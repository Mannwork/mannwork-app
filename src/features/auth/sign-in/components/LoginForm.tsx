import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { router } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';

import CustomInput from '@/common/components/CustomInput';
import MyKeyboardAvoidingView from '@/common/components/MyKeyboardAvoidingView';

import { clerkErrorValidator } from '../../utils/clerkErrorValidator';

import AuthButton from '../../components.tsx/AuthButton';
import { SignInFields, signInCredentialsScheme } from '../validators/signInCredentials.validator';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit, setError, formState: { errors }} = useForm<SignInFields>({
    resolver: zodResolver(signInCredentialsScheme),
  });

  const {signIn, isLoaded, setActive} = useSignIn();

  const onSignIn = async (data: SignInFields) => {
    if (!isLoaded) return;

    try {

      setLoading(true);

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

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/(auth)/sign-up');
  }

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
          placeholder="Ingrese su contraseña"
          secureTextEntry
          autoComplete='password'
          autoCapitalize='none'
        />

        {errors.root && (
            <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
        )}

        <View className='flex-row justify-between'>
          <Pressable>
            <Text className='text-sm text-text-secondary'>¿Olvidaste tu contraseña?</Text>
          </Pressable>
          <Pressable onPress={goToRegister}>
            <Text className='text-sm text-text-secondary'>¿No tienes una cuenta? <Text className='font-semibold'>Registrate</Text></Text>
          </Pressable>
          </View>
      </View>

      <AuthButton
        onPress={handleSubmit(onSignIn)}
      >
        {loading ? <ActivityIndicator color="#2d7a3e" size="small" /> : <Text className='font-semibold'>Iniciar sesión</Text>}
      </AuthButton>
    </MyKeyboardAvoidingView>
  )
}

export default LoginForm