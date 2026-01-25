// 语言翻译配置
export const translations = {
  zh: {
    title: '密码生成器',
    subtitle: '快速生成安全可靠的密码',
    placeholder: '点击下方按钮生成密码',
    passwordLength: '密码长度：',
    includeCharTypes: '包含字符类型：',
    uppercase: '大写字母 (A-Z)',
    lowercase: '小写字母 (a-z)',
    numbers: '数字 (0-9)',
    symbols: '特殊字符 (!@#$%^&*)',
    generate: '生成密码',
    copy: '复制密码',
    copied: '密码已复制到剪贴板！',
    copyError: '复制失败，请手动复制',
    generateFirst: '请先生成密码！',
    selectAtLeastOne: '请至少选择一种字符类型！',
    selectAtLeastOneType: '请至少选择一种字符类型',
  },
  en: {
    title: 'Password Generator',
    subtitle: 'Generate secure and reliable passwords quickly',
    placeholder: 'Click the button below to generate password',
    passwordLength: 'Password Length: ',
    includeCharTypes: 'Include Character Types:',
    uppercase: 'Uppercase (A-Z)',
    lowercase: 'Lowercase (a-z)',
    numbers: 'Numbers (0-9)',
    symbols: 'Symbols (!@#$%^&*)',
    generate: 'Generate Password',
    copy: 'Copy Password',
    copied: 'Password copied to clipboard!',
    copyError: 'Copy failed, please copy manually',
    generateFirst: 'Please generate a password first!',
    selectAtLeastOne: 'Please select at least one character type!',
    selectAtLeastOneType: 'Please select at least one character type',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.zh;
