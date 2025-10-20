import { createFormHook } from '@tanstack/react-form';

import {
  SelectForm as Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../-components/form-components';
import { fieldContext, formContext } from './form-context';

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
