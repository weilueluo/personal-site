import IconedText from "@/components/ui/icon-text";
import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { MdExpandMore, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import * as dropdown from "../../ui/dropdown";
import { FILTER_NAMES, FILTER_NAME_DISPLAY_MAP } from "../fast-filters";
import { FilterItem } from "./common";

export interface QuickFilterProps<T> extends BaseCompProps<"span"> {
    name: T;
    names: T[];
    onNameClick: (name: T) => void;
}

export function QuickFilter<T extends FILTER_NAMES>({
    name,
    onNameClick,
    names,
    className,
    messages,
    ...rest
}: QuickFilterProps<T>) {
    return (
        <dropdown.Container>
            <span
                className={tm(
                    "std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize",
                    className
                )}
                {...rest}>
                <MdExpandMore className="inline-block" />
                <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
            </span>
            <dropdown.Dropdown variant="glass">
                {names.map(name => (
                    <div key={name} className="std-hover min-w-full px-2 capitalize" onClick={() => onNameClick(name)}>
                        <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
                    </div>
                ))}
            </dropdown.Dropdown>
        </dropdown.Container>
    );
}

export interface BooleanQuickFilterProps extends BaseCompProps<"span"> {
    name: FILTER_NAMES;
    active: boolean;
}
export function BooleanQuickFilter({ name, active, messages, ...rest }: BooleanQuickFilterProps) {
    return (
        <span
            className="std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize"
            {...rest}>
            {active ? <MdOutlineRadioButtonChecked /> : <MdOutlineRadioButtonUnchecked />}
            <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
        </span>
    );
}

export function FilterPanel<T extends FilterItem>({
    title,
    filterItems,
    toggleSelection,
    many = false,
}: {
    title?: string;
    filterItems: T[];
    toggleSelection: (item: T) => void;
    many?: boolean;
}) {
    return (
        <div className="flex max-h-fit flex-col gap-2">
            {title && (
                <>
                    <span className="font-semibold">{title}</span>
                </>
            )}
            <div className={tm(many && "resize-y overflow-y-auto")}>
                <div className={tm("flex flex-row flex-wrap gap-2 text-sm", many && "h-72")}>
                    {filterItems.map(item => (
                        <FilterLabel key={item.name} item={item} toggleSelection={toggleSelection} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function FilterLabel<T extends FilterItem>({
    item,
    toggleSelection,
}: {
    item: T;
    toggleSelection: (item: T) => void;
}) {
    return (
        <span
            key={item.name}
            className={tm(
                "std-pad std-hover h-fit bg-gray-500 text-gray-300",
                // item.active && "bg-gray-600 hover:bg-gray-500",
                // !item.active && "bg-gray-500 hover:bg-gray-600",
                !item.active && item.isAdult && "opacity-75",
                item.type === "clearAll" &&
                    "bg-gray-400 animate-in fade-in-0 slide-in-from-left-8 duration-200 hover:bg-gray-600"
            )}
            onClick={() => toggleSelection(item)}>
            {item.name}
        </span>
    );
}

export interface SearchSettingsProps extends BaseCompProps<"div"> {
    onClickShowFilter: () => void;
}
export function SearchSettings({ messages, onClickShowFilter }: SearchSettingsProps) {
    return (
        <IconedText onClick={onClickShowFilter}>
            <TbAdjustmentsHorizontal />
            <FormattedMessage id="anime.search.settings" messages={messages} />
        </IconedText>
    );
}
