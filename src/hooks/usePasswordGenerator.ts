import { useState, useCallback } from 'react';

// 字符集定义
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

interface PasswordOptions {
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export const usePasswordGenerator = () => {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState<PasswordOptions>({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  // 生成密码的核心函数
  const generatePassword = useCallback(() => {
    // 构建字符集
    let charset = '';
    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    // 检查是否至少选择了一种字符类型
    if (charset.length === 0) {
      return '请至少选择一种字符类型';
    }

    // 使用 crypto.getRandomValues() 生成更安全的随机数
    let newPassword = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charset.length;
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    return newPassword;
  }, [length, options]);

  // 更新密码长度
  const updateLength = useCallback((newLength: number) => {
    const validLength = Math.min(Math.max(newLength, 4), 64);
    setLength(validLength);
  }, []);

  // 更新字符选项
  const updateOptions = useCallback((newOptions: Partial<PasswordOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // 验证是否至少选择了一种字符类型
  const isValid = useCallback(() => {
    return (
      options.includeUppercase ||
      options.includeLowercase ||
      options.includeNumbers ||
      options.includeSymbols
    );
  }, [options]);

  return {
    password,
    length,
    options,
    generatePassword,
    updateLength,
    updateOptions,
    isValid,
  };
};
