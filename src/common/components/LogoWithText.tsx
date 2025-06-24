import { Image, ImageProps } from 'react-native';

const LogoWithText = ({className}: ImageProps) => {
  return (
    <Image
      source={require('../../assets/logo_with_text.png')}
      className={className}
    />
  )
};

export default LogoWithText;