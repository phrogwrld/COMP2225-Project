import HttpCodes from './HttpCodes';

class HttpError extends Error {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(message: string, public status: HttpCodes, public context?: any) {
		super(message);
	}
}

export default HttpError;
