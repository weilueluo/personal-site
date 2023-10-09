inspect_args

set -eo pipefail

# show aws profile for debug purpose
aws iam get-user --output json

## V3 Translation  ##########################################################
echo "Translating V3 site..."
cd "$V3_ROOT"
cd scripts/translate
poetry run main

## Build V3 image ##########################################################
echo "Building V3 image..."

do_build=0
TAG="${args[tag]}"

# use auto increment tag if not specified
if [ -z "${TAG}" ]; then
    echo "No tag specified"
    TAG=$(<$V3_NEXT_TAG_FILE)

    if [ "${args[--prev]}" = "1" ]; then
        echo "prev tag specified"
        TAG="$(($TAG-1))"
    fi

    echo "Setting TAG=$TAG"
    NEXT_V3_TAG="$(($TAG + 1))"
    echo "$NEXT_V3_TAG" >"$V3_NEXT_TAG_FILE"
    echo "Setting NEXT_TAG=$NEXT_V3_TAG"
    do_build=1
else
    echo "Tag specified"
    echo "TAG=$TAG"
fi

# force build if --force is specified
if [ "${args[--force]}" = "1" ]; then
    echo "Using --force"
    do_build=1
else
    echo "Not using --force"
fi

# build if do_build is 1
if [ $do_build = 1 ]; then
    echo "Building V3 image tag=$TAG ..."
    cd "$V3_ROOT"
    chmod +x build.sh
    ./build.sh "$TAG"
    
else
    echo "Not building as tag is specified and --force not used, assumed image to be already built."
fi

## Provision Infrastructure #####################################################
echo "Provisioning infrastructure..."

cd "$INFRA_ROOT"
terraform init
terraform apply -auto-approve -var "image=public.ecr.aws/d0l7r8j1/personal-website-v3:$TAG"

V1_BUCKET_NAME=$(terraform output -json v1 | jq -r .bucket_name)
V2_BUCKET_NAME=$(terraform output -json v2 | jq -r .bucket_name)

## Upload V1 site ##############################################################
echo "Updating V1 site bucket..."

if [ -d "$V1_OUTPUT_ROOT" ]; then
    echo "V1 site output found at \"$V1_OUTPUT_ROOT\", reusing existing build."
    # aws s3 sync . "s3://$(terraform output -raw s3_bucket_name)/" --delete
else
    echo "V1 site output not found at \"$V1_OUTPUT_ROOT\", rebuilding..."
    cd "$V1_ROOT"
    chmod +x build.sh
    ./build.sh
fi

aws s3 sync "$V1_OUTPUT_ROOT" "s3://$V1_BUCKET_NAME/" --delete

## Upload V2 site ##############################################################
echo "Updating V2 site bucket..."

if [ -d "$V2_OUTPUT_ROOT" ]; then
    echo "V2 site output found at \"$V2_OUTPUT_ROOT\", reusing existing build."
else
    echo "V2 site output not found at \"$V2_OUTPUT_ROOT\", rebuilding..."
    cd "$V2_ROOT"
    chmod +x build.sh
    ./build.sh
fi

aws s3 sync "$V2_OUTPUT_ROOT" "s3://$V2_BUCKET_NAME/" --delete
