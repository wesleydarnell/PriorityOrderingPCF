import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { IInputs, IOutputs } from './generated/ManifestTypes';
import { PriorityOrderingComponent } from './PriorityOrderingComponent.js';

/// <reference types="powerapps-component-framework" />
export class PriorityOrdering implements ComponentFramework.DatasetControl<IInputs> {
    private _container: HTMLDivElement;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this.renderReact(context);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement | void {
        this.renderReact(context);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }

    private renderReact(context: ComponentFramework.Context<IInputs>) {
        ReactDOM.render(
            React.createElement(PriorityOrderingComponent, { context }),
            this._container
        );
    }
}
