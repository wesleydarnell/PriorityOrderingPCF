import * as React from "react";
import { Label, Input } from "@fluentui/react-components";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  IDetailsRowProps,
  IDetailsRowStyles,
  IDetailsListStyles,
  IDetailsHeaderProps,
  IDetailsHeaderStyles,
} from "@fluentui/react/lib/DetailsList";

import { IInputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface Idataset {
  name?: string;
  dataset?: DataSet;
}

interface IdatasetState {
  items: Record<string, unknown>[];
  filteredItems: Record<string, unknown>[]; // Filtered data based on search
  searchText: string;
  sortedColumnKey: string; // Track which column is sorted
  isSortedDescending: boolean;
}

export class dataset extends React.Component<
  Idataset,
  IdatasetState
> {
  constructor(props: Idataset) {
    super(props);
    const items = this.getRecordsFromDataset(props.dataset);
    this.state = {
      items: this.getRecordsFromDataset(props.dataset),
      filteredItems: items, // Initially same as items
      searchText: "",
      sortedColumnKey: "", // Track which column is sorted
      isSortedDescending: false, // Track sorting order
    };
  }

  componentDidUpdate(prevProps: Idataset) {
    if (prevProps.dataset !== this.props.dataset) {
      const items = this.getRecordsFromDataset(this.props.dataset);
      this.setState({ items, filteredItems: items });
    }
  }

  private getRecordsFromDataset(dataset?: DataSet): Record<string, unknown>[] {
    if (!dataset?.sortedRecordIds?.length) return [];

    return dataset.sortedRecordIds.map((id: string) => {
      const record = dataset.records[id];
      const formattedRecord: Record<string, unknown> = { id };

      dataset.columns.forEach((column) => {
        formattedRecord[column.name] =
          record?.getFormattedValue(column.name) ??
          record?.getValue(column.name) ??
          "";
      });

      return formattedRecord;
    });
  }

  private getColumns(items: Record<string, unknown>[]): IColumn[] {
    if (!this.props.dataset?.columns) return []; // Ensure an array is always returned

    return this.props.dataset.columns.map((column) => ({
      key: column.name, // Schema name as key
      name: column.displayName || column.name, // ✅ Use display name, fallback to schema name
      fieldName: column.name, // Keep schema name for data binding
      minWidth: 100,
      maxWidth: 400,
      isResizable: true,
      isMultiline: true,
      flexGrow: 1,
      onColumnClick: this.onColumnClick,
      isSorted: this.state.sortedColumnKey === column.name,
      isSortedDescending: this.state.sortedColumnKey === column.name ? this.state.isSortedDescending : false,
      onRender: (item: Record<string, unknown>) => {
        return (<span>item[column.name] ?? "-"</span>); // Ensure column values are displayed correctly
      }
    }));
  }

  private onColumnClick = (
    _event: React.MouseEvent<HTMLElement>,
    column: IColumn
  ) => {
    const { items, sortedColumnKey, isSortedDescending } = this.state;
  
    const newIsSortedDescending =
      sortedColumnKey === column.key ? !isSortedDescending : false;
  
    const fieldName = column.fieldName!;
  
    const sortedItems = [...items].sort((a, b) => {
      const getValueAsString = (value: unknown): string => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase();
        }
        return "";
      };
  
      const valueA = getValueAsString(a[fieldName]);
      const valueB = getValueAsString(b[fieldName]);
  
      return newIsSortedDescending
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    });
  
    this.setState({
      items: sortedItems,
      filteredItems: sortedItems, // ✅ Update filteredItems too
      sortedColumnKey: column.key,
      isSortedDescending: newIsSortedDescending,
    });
  };

  private onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    this.setState({ searchText });

    if (searchText.length > 2) {
      const filteredItems = this.state.items.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      this.setState({ filteredItems });
    } else {
      this.setState({ filteredItems: this.state.items });
    }
  };

  public render(): React.ReactNode {
    const { name } = this.props;
    const { items, searchText } = this.state;

    return (
      <div className="pcf-container" style={{ width: "100%", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
          <Label style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            Hello {name}!
          </Label>
          <Input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={this.onSearchChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </div>
        {items.length > 0 ? (
          <DetailsList
          items={this.state.filteredItems} // ✅ Use filteredItems here
          columns={this.getColumns(this.state.filteredItems)}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
            styles={detailsListStyles}
            onRenderRow={(props, defaultRender) => {
              if (!props || !defaultRender) return null;
              return defaultRender({
                ...props,
                styles: getRowStyles(props),
              });
            }}
            onRenderDetailsHeader={(props, defaultRender) =>
              props && defaultRender ? defaultRender({ ...props, styles: headerStyles }) : null
            }
          />
        ) : (
          <Label style={{ fontSize: "14px", color: "#666" }}>
            No records found
          </Label>
        )}
      </div>
    );
  }
}

// ✅ Overall table styles
const detailsListStyles: Partial<IDetailsListStyles> = {
  root: {
    background: "#6082B6",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "100%"
  },
};

// ✅ Header styles (Orange background, center-aligned, no hover effect)
const headerStyles: Partial<IDetailsHeaderStyles> = {
  root: {
    backgroundColor: "#6082B6",
    color: "black",
    fontWeight: "bold",
    borderBottom: "2px solid #6082B6",
    cursor: "pointer",
    padding: "0px",
    height: "35px",
    textAlign: "left",
    selectors: {
      ":hover": {
        backgroundColor: "inherit !important", // Prevents hover effect
      },
      ":focus": {
        backgroundColor: "inherit !important", // Prevents focus effect
      },
    },
  },
};


// ✅ Row styles (Alternating background color, left-aligned text)
const getRowStyles = (props: IDetailsRowProps): Partial<IDetailsRowStyles> => ({
  root: {
    backgroundColor: props.itemIndex !== undefined && props.itemIndex % 2 === 0 ? "#EAF3FC" : "white",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    textAlign: "left", // Ensures row values are left-aligned
  },
});