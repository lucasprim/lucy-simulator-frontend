import development from './development';
import production from './production';

let configuration = development;

if (process.env.NODE_ENV === 'development') {
  configuration = development;
} else if (process.env.NODE_ENV === 'production') {
  configuration = production;
}

export default Object.freeze(configuration);
