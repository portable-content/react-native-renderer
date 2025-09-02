# Dynamic Props in ResponsiveComponents

All ResponsiveComponents support **dynamic property changes** in real-time. This means you can update any prop (background color, padding, dimensions, etc.) and the component will immediately reflect the changes without re-mounting.

## ✅ **Fully Supported Dynamic Props**

### **ResponsiveContainer**

```tsx
const [bgColor, setBgColor] = useState('#ffffff');
const [padding, setPadding] = useState(16);
const [showShadow, setShowShadow] = useState(true);

<ResponsiveContainer
  backgroundColor={bgColor} // ✅ Dynamic
  padding={padding} // ✅ Dynamic
  borderRadius={8} // ✅ Dynamic
  showShadow={showShadow} // ✅ Dynamic
  width={300} // ✅ Dynamic
  height={200} // ✅ Dynamic
  style={{ opacity: 0.8 }} // ✅ Dynamic
>
  <Text>Content updates instantly!</Text>
</ResponsiveContainer>;
```

### **ResponsiveImage**

```tsx
const [imageSource, setImageSource] = useState({ uri: 'image1.jpg' });
const [bgColor, setBgColor] = useState('#ffffff');

<ResponsiveImage
  source={imageSource} // ✅ Dynamic - changes image
  backgroundColor={bgColor} // ✅ Dynamic
  padding={16} // ✅ Dynamic
  borderRadius={8} // ✅ Dynamic
  width={200} // ✅ Dynamic
  height={150} // ✅ Dynamic
  preserveAspectRatio={true} // ✅ Dynamic
/>;
```

### **ResponsiveSvg**

```tsx
const [svgContent, setSvgContent] = useState('<svg>...</svg>');
const [bgColor, setBgColor] = useState('#ffffff');

<ResponsiveSvg
  svgContent={svgContent} // ✅ Dynamic - changes SVG
  svgUri="https://example.svg" // ✅ Dynamic
  backgroundColor={bgColor} // ✅ Dynamic
  padding={16} // ✅ Dynamic
  width={120} // ✅ Dynamic
  height={120} // ✅ Dynamic
  preserveAspectRatio={true} // ✅ Dynamic
/>;
```

### **ResponsiveMarkup**

```tsx
const [content, setContent] = useState('<b>Hello</b> World!');
const [textColor, setTextColor] = useState('#333');

<ResponsiveMarkup
  content={content} // ✅ Dynamic - changes content
  backgroundColor="#ffffff" // ✅ Dynamic
  textColor={textColor} // ✅ Dynamic
  fontSize={16} // ✅ Dynamic
  maxHeight={200} // ✅ Dynamic
/>;
```

## 🎯 **Common Use Cases**

### **1. Theme Switching**

```tsx
function ThemeableWindow() {
  const [isDark, setIsDark] = useState(false);

  const theme = {
    backgroundColor: isDark ? '#2d3748' : '#ffffff',
    textColor: isDark ? '#e2e8f0' : '#333333',
  };

  return (
    <ResponsiveContainer
      backgroundColor={theme.backgroundColor}
      showShadow={!isDark}
    >
      <ResponsiveMarkup
        content="<b>Dynamic Theme!</b>"
        textColor={theme.textColor}
        backgroundColor={theme.backgroundColor}
      />
      <Button title="Toggle Theme" onPress={() => setIsDark(!isDark)} />
    </ResponsiveContainer>
  );
}
```

### **2. Animated Properties**

```tsx
function AnimatedContainer() {
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => (prev === 1 ? 1.1 : 1));
      setColor(prev => (prev === '#ffffff' ? '#f0f8ff' : '#ffffff'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer
      backgroundColor={color}
      style={{ transform: [{ scale }] }}
    >
      <Text>Animated Container!</Text>
    </ResponsiveContainer>
  );
}
```

### **3. Dynamic Content Loading**

```tsx
function DynamicImageGallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://picsum.photos/200/150?random=1',
    'https://picsum.photos/200/150?random=2',
    'https://picsum.photos/200/150?random=3',
  ];

  return (
    <ResponsiveContainer>
      <ResponsiveImage
        source={{ uri: images[currentImage] }}
        width={200}
        height={150}
      />
      <Button
        title="Next Image"
        onPress={() => setCurrentImage(prev => (prev + 1) % images.length)}
      />
    </ResponsiveContainer>
  );
}
```

### **4. Responsive Window System**

```tsx
function DynamicWindow({ windowId, isActive }) {
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ResponsiveContainer
      backgroundColor={isActive ? '#e3f2fd' : '#f5f5f5'}
      width={size.width}
      height={size.height}
      showShadow={isActive}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      <Text>Window {windowId}</Text>
      <Button
        title="Resize"
        onPress={() =>
          setSize({
            width: size.width === 300 ? 400 : 300,
            height: size.height === 200 ? 250 : 200,
          })
        }
      />
    </ResponsiveContainer>
  );
}
```

## ⚡ **Performance Considerations**

### **Optimized Re-renders**

- Components only re-render when props actually change
- Uses React's built-in optimization for style objects
- ScreenProvider context prevents unnecessary re-renders

### **Best Practices**

```tsx
// ✅ Good - Memoize complex calculations
const expensiveStyle = useMemo(
  () => ({
    backgroundColor: calculateColor(theme, state),
    transform: [{ scale: animatedValue }],
  }),
  [theme, state, animatedValue]
);

// ✅ Good - Use callback for event handlers
const handleColorChange = useCallback(color => {
  setBgColor(color);
}, []);

// ❌ Avoid - Creating new objects on every render
<ResponsiveContainer
  style={{ backgroundColor: Math.random() > 0.5 ? 'red' : 'blue' }}
/>;
```

## 🔄 **State Management Integration**

### **With Redux**

```tsx
function ConnectedComponent() {
  const theme = useSelector(state => state.theme);
  const windowState = useSelector(state => state.windows.current);

  return (
    <ResponsiveContainer
      backgroundColor={theme.backgroundColor}
      width={windowState.width}
      height={windowState.height}
    >
      {/* Content */}
    </ResponsiveContainer>
  );
}
```

### **With Context**

```tsx
const ThemeContext = createContext();

function ThemedComponent() {
  const { colors, spacing } = useContext(ThemeContext);

  return (
    <ResponsiveContainer
      backgroundColor={colors.background}
      padding={spacing.medium}
    >
      {/* Content */}
    </ResponsiveContainer>
  );
}
```

## 🎨 **Advanced Examples**

### **Color Picker Integration**

```tsx
function ColorPickerDemo() {
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  return (
    <View>
      <ColorPicker color={selectedColor} onColorChange={setSelectedColor} />
      <ResponsiveContainer
        backgroundColor={selectedColor}
        style={{ marginTop: 20 }}
      >
        <Text>Live color preview!</Text>
      </ResponsiveContainer>
    </View>
  );
}
```

### **Gesture-Based Resizing**

```tsx
function ResizableWindow() {
  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });

  const panGesture = Gesture.Pan().onUpdate(event => {
    setDimensions({
      width: Math.max(100, dimensions.width + event.translationX),
      height: Math.max(100, dimensions.height + event.translationY),
    });
  });

  return (
    <GestureDetector gesture={panGesture}>
      <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
        <Text>Drag to resize!</Text>
      </ResponsiveContainer>
    </GestureDetector>
  );
}
```

## 📱 **Responsive Behavior**

Dynamic props work seamlessly with the responsive system:

```tsx
function ResponsiveDynamicComponent() {
  const [customPadding, setCustomPadding] = useState(null);

  return (
    <ResponsiveContainer
      padding={customPadding} // When null, uses responsive padding
      backgroundColor="#f0f8ff"
    >
      <Text>
        {customPadding
          ? `Custom padding: ${customPadding}px`
          : 'Using responsive padding'}
      </Text>
      <Button
        title="Toggle Custom Padding"
        onPress={() => setCustomPadding(customPadding ? null : 24)}
      />
    </ResponsiveContainer>
  );
}
```

## 🚀 **Getting Started**

1. **Install the package** with ScreenProvider
2. **Wrap your app** with ScreenProvider
3. **Use state** to control any prop dynamically
4. **Update state** to see instant changes

```tsx
import {
  ScreenProvider,
  ResponsiveContainer,
} from 'react-native-responsive-components';

function App() {
  return (
    <ScreenProvider>
      <YourDynamicComponents />
    </ScreenProvider>
  );
}
```

All ResponsiveComponents are designed to handle dynamic props efficiently and smoothly, making them perfect for interactive applications, windowing systems, and dynamic user interfaces! 🎉
