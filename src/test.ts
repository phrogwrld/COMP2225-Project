import HttpCodes from './common/HttpCodes';
import HttpError from './common/HttpError';

class Ttt {
	public static main() {
		return new HttpError('test', HttpCodes.ACCEPTED);
	}
}
export default Ttt;
