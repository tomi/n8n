import type { INode, JsonObject } from '../Interfaces';
import type { NodeOperationErrorOptions } from './node-api.error';
import { NodeError } from './abstract/node.error';
import { ApplicationError } from './application.error';

/**
 * Class for instantiating an operational error, e.g. an invalid credentials error.
 */
export class NodeOperationError extends NodeError {
	type: string | undefined;

	obfuscate: boolean = false;

	constructor(
		node: INode,
		error: Error | string | JsonObject,
		options: NodeOperationErrorOptions = {},
	) {
		if (error instanceof NodeOperationError) {
			return error;
		}

		let obfuscateErrorMessage = false;

		if (typeof error === 'string') {
			error = new ApplicationError(error);
		} else if (!(error instanceof ApplicationError)) {
			// this error was no processed by n8n, obfuscate error message
			obfuscateErrorMessage = true;
		}

		super(node, error);

		if (error instanceof NodeError && error?.messages?.length) {
			error.messages.forEach((message) => this.addToMessages(message));
		}

		if (obfuscateErrorMessage && !options.description) {
			const originalMessage = typeof error === 'string' ? error : (error.message as string);
			this.addToMessages(originalMessage);
			this.obfuscate = true;
		}
		if (options.message) this.message = options.message;
		if (options.level) this.level = options.level;
		if (options.functionality) this.functionality = options.functionality;
		if (options.type) this.type = options.type;
		this.description = options.description;
		this.context.runIndex = options.runIndex;
		this.context.itemIndex = options.itemIndex;

		if (this.message === this.description) {
			this.description = undefined;
		}

		[this.message, this.messages] = this.setDescriptiveErrorMessage(
			this.message,
			this.messages,
			undefined,
			options.messageMapping,
		);
	}
}
