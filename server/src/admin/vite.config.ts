import { mergeConfig, UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      dedupe: [
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@codemirror/search',
        '@codemirror/lint',
        '@codemirror/commands',
      ],
    },
  });
};