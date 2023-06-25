check_command() {
    if ! type "$1" > /dev/null; then
        echo_error "$1 not found"
        exit 1
    fi
}