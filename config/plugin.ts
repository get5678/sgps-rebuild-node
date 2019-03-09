import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  logger: {
    enable: true,
    package: 'egg-logger',
  },
};

export default plugin;
