import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { IInputs, IOutputs } from './generated/ManifestTypes';
import { Idataset, dataset } from './PriorityOrderingComponent';

/// <reference types="powerapps-component-framework" />
export class PriorityOrdering implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this.renderReact(context);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return this.renderReact(context);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }

    private renderReact(context: ComponentFramework.Context<IInputs>) {
        const dataset_items = context.parameters.items; // No need for unnecessary type assertion

        const props: Idataset = {
            name: 'priorityOrdering',
            dataset: dataset_items
        };

        return React.createElement(dataset, { ...props, key: dataset_items?.sortedRecordIds?.join(",") });
    }
}
