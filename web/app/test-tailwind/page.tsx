export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tailwind CSS 3.4 测试
        </h1>

        <div className="space-y-6">
          {/* Test card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Padding 测试</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-500 text-white px-4 py-3 rounded">
                px-4 py-3
              </div>
              <div className="bg-green-500 text-white px-6 py-4 rounded">
                px-6 py-4
              </div>
              <div className="bg-purple-500 text-white px-8 py-6 rounded">
                px-8 py-6
              </div>
            </div>
          </div>

          {/* Test buttons */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Button 测试</h2>
            <div className="flex gap-4">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
                Primary Button
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Test form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Input 测试</h2>
            <input
              type="text"
              placeholder="测试输入框"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Expected Results */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            预期结果：
          </h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>三个彩色方块应该有不同的 padding</li>
            <li>按钮应该有 hover 效果</li>
            <li>输入框应该有 focus ring 效果</li>
            <li>所有样式应该正确应用（不是 0px）</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
