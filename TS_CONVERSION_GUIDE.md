# TypeScript Conversion Guide

## Completed Steps

1. TypeScript dependencies installed:

   - typescript
   - @types/react
   - @types/react-native
   - @typescript-eslint/eslint-plugin
   - @typescript-eslint/parser

2. Configuration files created/updated:

   - tsconfig.json
   - babel.config.js
   - metro.config.js
   - package.json (updated main entry to index.ts)

3. Core files converted:

   - App.js → App.tsx
   - index.js → index.ts
   - src/utils/theme.js → src/utils/theme.ts (with proper types)
   - src/utils/biometrics.js → src/utils/biometrics.ts (with proper types)
   - src/context/ThemeContext.js → src/context/ThemeContext.tsx (with proper types)

4. Created types.d.ts for shared type definitions.

5. Created initial TypeScript versions of all JavaScript files.

## Next Steps

1. **Add Types to Converted Files**:

   - Go through each TypeScript file and add proper type annotations
   - Pay special attention to component props and state
   - Fix any "any" types with more specific types

2. **Fix TypeScript Errors**:

   - Run `npx tsc --noEmit` to check for TypeScript errors
   - Fix errors one by one until the project compiles cleanly

3. **Delete Original JS Files**:

   - Once you've verified the TypeScript versions work correctly, delete the original JavaScript files

4. **Update Imports**:

   - Make sure all imports reference .ts/.tsx files (usually this happens automatically)

5. **Test the Application**:
   - Test all functionality to ensure the conversion didn't break anything

## Best Practices

1. **Gradual Conversion**:

   - Focus on one module at a time
   - Start with utility functions, then contexts, then components

2. **Common Types**:

   - Use the types.d.ts file for shared types across the application
   - Create more specific type files if needed

3. **Props Typing**:

   - Always define interface for component props
   - Example: `interface ButtonProps { onPress: () => void; label: string; }`

4. **Context Typing**:

   - Ensure all context providers and consumers are properly typed
   - Define interfaces for context values and provider props

5. **Third-Party Libraries**:
   - Use DefinitelyTyped packages when available (@types/...)
   - Create custom declarations for libraries without typings

## Useful TypeScript-React Patterns

```tsx
// Component with props interface
interface CardProps {
  title: string;
  content: string;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({ title, content, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text>{title}</Text>
        <Text>{content}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Hooks with proper typing
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);

// Event handlers
const handlePress = (event: GestureResponderEvent): void => {
  // Handle the event
};
```

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)
- [React Native TypeScript Template](https://github.com/react-native-community/react-native-template-typescript)
