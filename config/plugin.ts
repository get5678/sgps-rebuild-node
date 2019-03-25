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
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  cos: {
    enable: true,
    package: 'egg-cos',
  },
};

export default plugin;
