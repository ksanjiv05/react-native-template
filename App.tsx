/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "./global.css"
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import all UI components
import {
  Text,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Input,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  RadioGroupItem,
  Badge,
  Avatar,
  Alert,
  Divider,
  Spinner,
  Container,
  Stack,
  Grid,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Dialog,
  ToastProvider,
  useToast,
  List,
  ListItem,
  ListSection,
  ListDivider,
  Collapsible,
  CollapsibleHeader,
  CollapsibleContent,
  Accordion,
} from './src/components/ui';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const toast = useToast();

  // State for form components
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [inputValue, setInputValue] = useState('');

  // State for new components
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container} className="bg-white dark:bg-gray-900">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Container padding="lg" maxWidth="full">
            <Stack spacing="lg">
              {/* Header */}
              <Text variant="h1" weight="bold" align="center" color="primary">
                UI Component Library
              </Text>
              <Text variant="body" color="muted" align="center">
                Testing all components with NativeWind
              </Text>

              <Divider />

              {/* Typography Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Typography</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Text variant="h1">Heading 1</Text>
                    <Text variant="h2">Heading 2</Text>
                    <Text variant="h3">Heading 3</Text>
                    <Text variant="body">Body text</Text>
                    <Text variant="caption" color="muted">Caption text</Text>
                    <Text variant="small" color="muted">Small text</Text>
                  </Stack>
                </CardContent>
              </Card>

              {/* Buttons Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Buttons</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Button variant="primary" size="md" onPress={() => console.log('Primary')}>
                      Primary Button
                    </Button>
                    <Button variant="secondary" size="md" onPress={() => console.log('Secondary')}>
                      Secondary Button
                    </Button>
                    <Button variant="outline" size="md" onPress={() => console.log('Outline')}>
                      Outline Button
                    </Button>
                    <Button variant="ghost" size="md" onPress={() => console.log('Ghost')}>
                      Ghost Button
                    </Button>
                    <Button variant="destructive" size="md" onPress={() => console.log('Destructive')}>
                      Destructive Button
                    </Button>
                    <Button variant="primary" size="sm" loading>
                      Loading...
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Forms Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Form Controls</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="md">
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      value={inputValue}
                      onChangeText={setInputValue}
                      helperText="We'll never share your email"
                    />
                    <Input
                      label="Password"
                      placeholder="Enter password"
                      error="Password is required"
                      secureTextEntry
                    />

                    <Divider color="muted" />

                    <Switch
                      label="Enable notifications"
                      value={switchValue}
                      onValueChange={setSwitchValue}
                    />

                    <Checkbox
                      label="I agree to terms and conditions"
                      checked={checkboxValue}
                      onCheckedChange={setCheckboxValue}
                    />

                    <Text variant="caption" weight="semibold">Choose an option:</Text>
                    <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                      <RadioGroupItem value="option1" label="Option 1" />
                      <RadioGroupItem value="option2" label="Option 2" />
                      <RadioGroupItem value="option3" label="Option 3" />
                    </RadioGroup>
                  </Stack>
                </CardContent>
              </Card>

              {/* Badges Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Badges</Text>
                </CardHeader>
                <CardContent>
                  <Stack direction="row" spacing="sm" wrap>
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </Stack>
                </CardContent>
              </Card>

              {/* Avatars Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Avatars</Text>
                </CardHeader>
                <CardContent>
                  <Stack direction="row" spacing="md" align="center">
                    <Avatar size="sm" fallback="JD" />
                    <Avatar size="md" fallback="John Doe" />
                    <Avatar size="lg" fallback="AB" />
                    <Avatar size="xl" fallback="CD" />
                  </Stack>
                </CardContent>
              </Card>

              {/* Alerts Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Alerts</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Alert
                      variant="default"
                      title="Default Alert"
                      description="This is a default alert message"
                    />
                    <Alert
                      variant="info"
                      title="Info"
                      description="This is an informational message"
                    />
                    <Alert
                      variant="success"
                      title="Success"
                      description="Your action was completed successfully"
                    />
                    <Alert
                      variant="warning"
                      title="Warning"
                      description="Please review this warning carefully"
                    />
                    <Alert
                      variant="error"
                      title="Error"
                      description="An error occurred while processing"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Loading Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Loading Spinners</Text>
                </CardHeader>
                <CardContent>
                  <Stack direction="row" spacing="lg" align="center" justify="around">
                    <Spinner size="sm" color="primary" label="Small" />
                    <Spinner size="md" color="primary" label="Medium" />
                    <Spinner size="lg" color="primary" label="Large" />
                  </Stack>
                </CardContent>
              </Card>

              {/* Grid Layout Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Grid Layout</Text>
                </CardHeader>
                <CardContent>
                  <Grid columns={2} spacing="md">
                    <Card variant="outline" padding="sm">
                      <Text variant="caption" align="center">Grid 1</Text>
                    </Card>
                    <Card variant="outline" padding="sm">
                      <Text variant="caption" align="center">Grid 2</Text>
                    </Card>
                    <Card variant="outline" padding="sm">
                      <Text variant="caption" align="center">Grid 3</Text>
                    </Card>
                    <Card variant="outline" padding="sm">
                      <Text variant="caption" align="center">Grid 4</Text>
                    </Card>
                  </Grid>
                </CardContent>
              </Card>

              {/* Modal/Dialog Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Modals & Dialogs</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Button variant="primary" onPress={() => setModalVisible(true)}>
                      Open Modal
                    </Button>
                    <Button variant="secondary" onPress={() => setDialogVisible(true)}>
                      Open Dialog
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Toast Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Toasts</Text>
                </CardHeader>
                <CardContent>
                  <Stack spacing="sm">
                    <Button variant="primary" size="sm" onPress={() => toast.success('Success message!')}>
                      Show Success
                    </Button>
                    <Button variant="destructive" size="sm" onPress={() => toast.error('Error message!')}>
                      Show Error
                    </Button>
                    <Button variant="outline" size="sm" onPress={() => toast.warning('Warning message!')}>
                      Show Warning
                    </Button>
                    <Button variant="ghost" size="sm" onPress={() => toast.info('Info message!')}>
                      Show Info
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* List Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Lists</Text>
                </CardHeader>
                <CardContent>
                  <List variant="bordered">
                    <ListSection title="Settings">
                      <ListItem
                        leading={<Avatar size="sm" fallback="P" />}
                        trailing={<Text variant="caption" color="muted">→</Text>}
                        subtitle={<Text variant="caption" color="muted">Manage your profile</Text>}
                        onPress={() => console.log('Profile pressed')}
                        divider
                      >
                        <Text variant="body" weight="semibold">Profile</Text>
                      </ListItem>
                      <ListItem
                        leading={<Avatar size="sm" fallback="N" />}
                        trailing={<Switch value={switchValue} onValueChange={setSwitchValue} />}
                        subtitle={<Text variant="caption" color="muted">Push notifications</Text>}
                        divider
                      >
                        <Text variant="body" weight="semibold">Notifications</Text>
                      </ListItem>
                      <ListItem
                        leading={<Avatar size="sm" fallback="S" />}
                        trailing={<Text variant="caption" color="muted">→</Text>}
                        subtitle={<Text variant="caption" color="muted">Privacy & Security</Text>}
                        onPress={() => console.log('Security pressed')}
                      >
                        <Text variant="body" weight="semibold">Security</Text>
                      </ListItem>
                    </ListSection>
                  </List>
                </CardContent>
              </Card>

              {/* Collapsible/Accordion Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Text variant="h2" weight="bold">Collapsible & Accordion</Text>
                </CardHeader>
                <CardContent>
                  <Accordion allowMultiple={false}>
                    <Collapsible
                      title={<Text variant="body" weight="semibold">What is React Native?</Text>}
                    >
                      <CollapsibleContent>
                        <Text variant="body" color="muted">
                          React Native is a framework for building native mobile apps using React.
                        </Text>
                      </CollapsibleContent>
                    </Collapsible>

                    <ListDivider />

                    <Collapsible
                      title={<Text variant="body" weight="semibold">What is NativeWind?</Text>}
                    >
                      <CollapsibleContent>
                        <Text variant="body" color="muted">
                          NativeWind brings Tailwind CSS to React Native with an optimized styling engine.
                        </Text>
                      </CollapsibleContent>
                    </Collapsible>

                    <ListDivider />

                    <Collapsible
                      title={<Text variant="body" weight="semibold">How to use these components?</Text>}
                    >
                      <CollapsibleContent>
                        <Text variant="body" color="muted">
                          Import them from the UI component library and customize with props and Tailwind classes.
                        </Text>
                      </CollapsibleContent>
                    </Collapsible>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Final Card */}
              <Card variant="outline">
                <CardContent>
                  <Text variant="body" align="center" color="muted">
                    All components are working! 🎉
                  </Text>
                </CardContent>
                <CardFooter>
                  <Text variant="caption" align="center" color="muted">
                    Modal, Dialog, Toast, List, and Collapsible added!
                  </Text>
                </CardFooter>
              </Card>

            </Stack>
          </Container>
        </ScrollView>

        {/* Modals */}
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          size="md"
          position="center"
        >
          <ModalHeader onClose={() => setModalVisible(false)}>
            <Text variant="h3" weight="bold">Modal Title</Text>
          </ModalHeader>
          <ModalContent>
            <Text variant="body">
              This is a modal dialog. You can put any content here including forms, images, or other components.
            </Text>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" size="sm" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onPress={() => setModalVisible(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>

        <Dialog
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          title="Confirm Action"
          description="Are you sure you want to perform this action? This cannot be undone."
          actions={
            <>
              <Button variant="outline" size="sm" onPress={() => setDialogVisible(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onPress={() => {
                setDialogVisible(false);
                toast.success('Action confirmed!');
              }}>
                Confirm
              </Button>
            </>
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
});

export default App;
