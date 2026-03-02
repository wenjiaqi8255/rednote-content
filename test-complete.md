# 完整功能测试文档

## 表格测试
| 功能 | 状态 | 备注 |
|-----|------|------|
| 表格 | ✅ | 完整支持 |
| LaTeX | ✅ | 行内和块级 |
| 代码高亮 | ✅ | 支持多种语言 |
| 列表 | ✅ | 嵌套列表 |

## LaTeX数学公式测试

### 行内公式
爱因斯坦质能方程: $E = mc^2$

欧拉公式: $e^{i\pi} + 1 = 0$

求和公式: $\sum_{i=1}^n i = \frac{n(n+1)}{2}$

### 块级公式
$$
\int_0^1 x^2 dx = \left[ \frac{x^3}{3} \right]_0^1 = \frac{1}{3}
$$

$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

矩阵示例:
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\times
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

## 代码测试

### JavaScript
```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 输出: 55
```

### Python
```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

### CSS
```css
.card-container {
  width: 1080px;
  min-height: 1440px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 嵌套测试

### 引用与列表
> 这是一个引用段落
> - 嵌套列表项1
> - 嵌套列表项2
> - 嵌套列表项3
>
> 引用可以包含**粗体**和*斜体*文本

### 多级列表
1. 第一级项目
   1.1 第二级项目
   1.2 另一个第二级项目
2. 另一个第一级项目
   - 子项A
   - 子项B

### 混合内容
> 代码块也可以在引用中
>
> ```python
> print("Hello from blockquote!")
> ```
>
> 引用结束

## 文本格式测试

这是**粗体文本**，这是*斜体文本*，这是***粗斜体文本***。

这是一个`行内代码`示例。

这里有一个[链接示例](https://github.com)。

---

## 分隔线

上面有分隔线，下面也有分隔线

---

## 特殊字符测试

版权符号: © 注册商标: ® 商标: ™

小于号: < 大于号: > 和号: &

## 中文排版测试

这是一个中文、English混合的段落。

中文字体：Noto Sans SC
英文字体：Source Han Sans CN
数字：1234567890

#数学公式 #LaTeX #代码高亮 #表格 #完整测试
