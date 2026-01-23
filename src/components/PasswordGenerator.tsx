import { useEffect } from 'react';
import { Lock, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const PasswordGenerator = () => {
  const {
    password,
    length,
    options,
    generatePassword,
    updateLength,
    updateOptions,
    isValid,
  } = usePasswordGenerator();

  // 页面加载时自动生成密码
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // 处理生成按钮点击
  const handleGenerate = () => {
    if (!isValid()) {
      toast.error('请至少选择一种字符类型！');
      return;
    }
    generatePassword();
  };

  // 处理复制到剪贴板
  const handleCopy = async () => {
    if (!password || password === '请至少选择一种字符类型') {
      toast.error('请先生成密码！');
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast.success('密码已复制到剪贴板！');
    } catch (err) {
      // 降级方案
      fallbackCopyToClipboard(password);
    }
  };

  // 降级复制方法
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      toast.success('密码已复制到剪贴板！');
    } catch (err) {
      toast.error('复制失败，请手动复制');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <Card className="w-full max-w-[500px] shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-3xl">
          <Lock className="h-7 w-7" />
          密码生成器
        </CardTitle>
        <CardDescription className="text-base">
          快速生成安全可靠的密码
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 密码显示区域 */}
        <div className="bg-muted/50 border-2 border-border rounded-xl p-5 min-h-[70px] flex items-center justify-center">
          <p className="text-2xl font-semibold text-center break-all tracking-wide font-mono">
            {password || '点击下方按钮生成密码'}
          </p>
        </div>

        {/* 密码长度控制 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="length-slider" className="text-base font-medium">
              密码长度：
              <span className="text-primary text-lg font-bold ml-2">{length}</span>
            </Label>
            <Input
              id="length-input"
              type="number"
              min={4}
              max={64}
              value={length}
              onChange={(e) => updateLength(parseInt(e.target.value) || 4)}
              className="w-20 text-center"
            />
          </div>
          <Slider
            id="length-slider"
            min={4}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => updateLength(value[0])}
            className="cursor-pointer"
          />
        </div>

        {/* 字符类型选择 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">包含字符类型：</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) =>
                  updateOptions({ includeUppercase: checked as boolean })
                }
              />
              <Label
                htmlFor="uppercase"
                className="text-sm font-normal cursor-pointer"
              >
                大写字母 (A-Z)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) =>
                  updateOptions({ includeLowercase: checked as boolean })
                }
              />
              <Label
                htmlFor="lowercase"
                className="text-sm font-normal cursor-pointer"
              >
                小写字母 (a-z)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) =>
                  updateOptions({ includeNumbers: checked as boolean })
                }
              />
              <Label
                htmlFor="numbers"
                className="text-sm font-normal cursor-pointer"
              >
                数字 (0-9)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) =>
                  updateOptions({ includeSymbols: checked as boolean })
                }
              />
              <Label
                htmlFor="symbols"
                className="text-sm font-normal cursor-pointer"
              >
                特殊字符 (!@#$%^&*)
              </Label>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleGenerate}
            className="w-full text-base font-semibold"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            生成密码
          </Button>
          <Button
            onClick={handleCopy}
            variant="secondary"
            className="w-full text-base font-semibold"
            size="lg"
          >
            <Copy className="mr-2 h-5 w-5" />
            复制密码
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
