import { useNavigation } from '@react-navigation/native';
import { Heading, Text, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { useState } from "react";
import Logo from '../assets/logo.svg';
import { api } from "../clients/api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function New() {
  const { navigate } = useNavigation();
  const [titulo, setTitulo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  async function handleCriarBolao() {
    if (!titulo || titulo.trim().length === 0) {
      return toast.show({
        title: 'Informe um título para o bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true)
      const resCriadoBolao = await api.post('/bolao', { titulo })

      toast.show({
        title: `Bolão criado com sucesso, o código é ${resCriadoBolao.data.codigo}!`,
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('polls')
    } catch (e: any) {
      console.error(e)
      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
      setTitulo('')
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily={'heading'}
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {'\n'}
          e compartilhe entre os amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão?"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Button
          title="Criar meu bolão"
          isLoading={isLoading}
          onPress={handleCriarBolao}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único
          que poderá usar para convidar outras pessoas
        </Text>
      </VStack>
    </VStack>
  )
}