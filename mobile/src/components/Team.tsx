import { HStack, Text } from 'native-base';
import CountryFlag from "react-native-country-flag";

import { Input } from './Input';

interface Props {
  code: string;
  value?: string;
  position: 'left' | 'right';
  onChangeText: (value: string) => void;
}

export function Team({ code, value, position, onChangeText }: Props) {
  return (
    <HStack alignItems="center">
      {position === 'left' && <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />}

      {
        !value &&
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize={"xs"}
          keyboardType="numeric"
          onChangeText={onChangeText}
          isDisabled={value !== ''}
        />
      }

      {
        value &&
        <Text
          w={10}
          h={9}
          textAlign="center"
          color="yellow.100"
          fontSize="2xl"
          fontFamily="heading">
          {value}
        </Text>
      }

      {position === 'right' && <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />}
    </HStack>
  );
}