import { useState, useCallback, useEffect } from 'react';

// 字符集定义
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

// 特殊字符分组 - 导出供 SymbolSelector 使用
export const SYMBOL_GROUPS = {
  common: '!@#$%^&*',
  brackets: '()[]{}',
  operators: '+-=',
  others: '_|;:,.<>?',
} as const;

// 获取所有特殊字符 - 导出供 SymbolSelector 使用
export const ALL_SYMBOLS = Object.values(SYMBOL_GROUPS).join('');

interface PasswordOptions {
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  customSymbols: string; // 用户自定义的特殊字符
}

const STORAGE_KEY = 'password-generator-options';

export const usePasswordGenerator = () => {
  // 从 localStorage 读取保存的配置
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState<PasswordOptions>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // 解析失败，使用默认值
      }
    }
    return {
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      customSymbols: ALL_SYMBOLS, // 默认全选
    };
  });

  // 保存配置到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  }, [options]);

  // 生成密码的核心函数
  const generatePassword = useCallback((errorMessage?: string) => {
    // 收集所有选中的字符集
    const selectedCharsets: string[] = [];
    if (options.includeUppercase) selectedCharsets.push(UPPERCASE);
    if (options.includeLowercase) selectedCharsets.push(LOWERCASE);
    if (options.includeNumbers) selectedCharsets.push(NUMBERS);
    if (options.includeSymbols && options.customSymbols) {
      selectedCharsets.push(options.customSymbols);
    }

    // 检查是否至少选择了一种字符类型
    if (selectedCharsets.length === 0) {
      return errorMessage || 'Please select at least one character type';
    }

    // 构建完整字符集
    const charset = selectedCharsets.join('');

    // 确保密码至少包含每种选中的字符类型
    let newPassword = '';
    
    // 第一步：从每个选中的字符集中各选一个字符
    const guaranteedChars: string[] = [];
    selectedCharsets.forEach((set) => {
      const randomValue = new Uint32Array(1);
      crypto.getRandomValues(randomValue);
      const randomIndex = randomValue[0] % set.length;
      guaranteedChars.push(set[randomIndex]);
    });

    // 第二步：填充剩余的字符（从完整字符集中随机选择）
    const remainingLength = length - guaranteedChars.length;
    if (remainingLength > 0) {
      const randomValues = new Uint32Array(remainingLength);
      crypto.getRandomValues(randomValues);

      for (let i = 0; i < remainingLength; i++) {
        const randomIndex = randomValues[i] % charset.length;
        guaranteedChars.push(charset[randomIndex]);
      }
    }

    // 第三步：打乱字符顺序（Fisher-Yates 洗牌算法）
    const shuffleArray = guaranteedChars.slice();
    const shuffleRandomValues = new Uint32Array(shuffleArray.length);
    crypto.getRandomValues(shuffleRandomValues);

    for (let i = shuffleArray.length - 1; i > 0; i--) {
      const j = shuffleRandomValues[i] % (i + 1);
      [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
    }

    newPassword = shuffleArray.join('');

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
      (options.includeSymbols && options.customSymbols.length > 0)
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
