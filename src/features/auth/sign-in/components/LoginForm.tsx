import { Text, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';

import CustomInput from '@/common/components/CustomInput';
import MyKeyboardAvoidingView from '@/common/components/MyKeyboardAvoidingView';

import { clerkErrorValidator } from '../../utils/clerkErrorValidator';

import { SignInFields, signInCredentialsScheme } from '../validators/signInCredentials.validator';
import SignInButton from './SignInButton';

const LoginForm = () => {
  const {control, handleSubmit, setError, formState: { errors }} = useForm<SignInFields>({
    resolver: zodResolver(signInCredentialsScheme),
  });

  const {signIn, isLoaded, setActive} = useSignIn();

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        setActive({session: signInAttempt.createdSessionId});
      } else {        
        setError('root', { message: 'Algo salió mal, intentalo de nuevo más tarde' });
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        error.errors.forEach((error) => {
          const {errorField, displayMessage} = clerkErrorValidator(error);
          setError(errorField as "email" | "password" | "root", { message: displayMessage });
        })
      } else {
        setError('root', { message: 'Algo salió mal, intentalo de nuevo más tarde' });
      }
    }
  };

  return (
    <MyKeyboardAvoidingView className='justify-between p-8'>
      <View>
        <CustomInput 
          control={control}
          name='email'
          placeholder="Ingrese su correo electrónico"
          autoFocus
          keyboardType='email-address'
          autoComplete='email'
          autoCapitalize='none'
        />
        <CustomInput 
          control={control}
          name='password'
          placeholder="Ingrese su correo contraseña"
          secureTextEntry
          autoComplete='password'
          autoCapitalize='none'
        />

        {errors.root && (
            <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
        )}
      </View>

      <SignInButton
        onPress={handleSubmit(onSignIn)}
      >
        <Text className='font-semibold'>Iniciar sesión</Text>
      </SignInButton>
    </MyKeyboardAvoidingView>
  )
}

export default LoginForm