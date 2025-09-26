import { Alert, type AlertButton } from 'react-native';

type FeedbackOptions = {
  title?: string;
  buttons?: AlertButton[];
};

const showAlert = (defaultTitle: string) => (message: string, options: FeedbackOptions = {}) => {
  const { title = defaultTitle, buttons } = options;
  Alert.alert(title, message, buttons);
};

export const showError = showAlert('Error');
export const showSuccess = showAlert('Success');
export const showInfo = showAlert('Notice');

export const showConfirmation = (
  title: string,
  message: string,
  buttons: AlertButton[],
) => {
  Alert.alert(title, message, buttons);
};
