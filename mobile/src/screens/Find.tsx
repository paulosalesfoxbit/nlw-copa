import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { api } from "../clients/api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export function Find() {
  const { navigate } = useNavigation();
  const [codigo, setCodigo] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  async function handleParticiparBolao() {
    if (!codigo || codigo.trim().length === 0) {
      return toast.show({
        title: 'Informe um código para o bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsLoading(true)
      const { status, data } = await api.post(`/bolao/participar`, { codigo })

      toast.show({
        title: `Você entrou no bolão com sucesso!`,
        placement: 'top',
        bgColor: 'green.500'
      })

      setIsLoading(false)
      setCodigo('')
      navigate('details', { id: data.id })
    } catch (e: any) {
      setIsLoading(false)
      setCodigo('')
      console.error(e)
      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily={'heading'}
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontrar um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          value={codigo}
          onChangeText={setCodigo}
        />

        <Button
          title="Buscar o bolão"
          isLoading={isLoading}
          onPress={handleParticiparBolao}
        />
      </VStack>
    </VStack>
  )
}