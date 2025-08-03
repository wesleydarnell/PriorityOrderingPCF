// PriorityOrderingComponent.tsx

import * as React from 'react';
import {
    DetailsList,
    IColumn,
    DetailsListLayoutMode,
    IDragDropEvents
} from '@fluentui/react';

interface Props {
    context: ComponentFramework.Context<any>;
}

export const PriorityOrderingComponent: React.FC<Props> = ({ context }) => {
    const dataset = context.parameters.items;
    type RecordType = { getValue: (field: string) => any; getFormattedValue: (field: string) => string; getNamedReference: () => { entityName: string; id: string }; };
    const [items, setItems] = React.useState<RecordType[]>(Object.values(dataset.records) as RecordType[]);

    React.useEffect(() => {
        const sorted = [...Object.values(dataset.records)].sort((a: any, b: any) => {
            return (a.getValue('sort_order') ?? 0) - (b.getValue('sort_order') ?? 0);
        });
        setItems(sorted as RecordType[]);
    }, [dataset.version]);
    const columns: IColumn[] = [
        {
            key: 'name',
            name: 'Name',
            fieldName: 'name',
            minWidth: 100,
            isResizable: true,
            onRender: (item: RecordType) => item.getFormattedValue('name'),
        },
    ];

    const onDragEnd = (fromIndex: number, toIndex?: number) => {
        if (toIndex === undefined || fromIndex === toIndex) return;
        const updated = [...items];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);

        updated.forEach((record: any, idx) => {
            const entity = record.getNamedReference();
            context.webAPI.updateRecord(entity.entityName, entity.id, {
                sort_order: idx + 1
            });
        });

        setItems(updated);
    };
    const dragDropEvents: IDragDropEvents = {
        onDragEnd: (item?: RecordType, event?: DragEvent) => {
            if (!item) return;
            const fromIndex = items.findIndex(i => i === item);
            // Since index is not provided, just keep the item in its current position
            onDragEnd(fromIndex, fromIndex);
        }
    };
    return (
        <DetailsList
            items={items}
            columns={columns}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            dragDropEvents={dragDropEvents}
        />
    );
};
