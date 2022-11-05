import { Octicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useCallback, useState } from 'react';
import { api } from '../clients/api';

import { Button } from "../components/Button";
import { EmptyPoolList } from '../components/EmptyPoolList';
import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { ParticipantProps } from '../components/Participants';
import { PoolCard, PoolProps } from '../components/PoolCard';

export function Polls() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [boloes, setBoloes] = useState<PoolProps[]>([]);

  async function getBoloes() {
    try {
      setIsLoading(true)
      const { status, data } = await api.get('/bolao/listar')

      setBoloes(data.map((d: any) => {
        return {
          id: d.id,
          code: d.codigo,
          title: d.titulo,
          createdAt: d.dtCriado,
          ownerId: d.criadorId,
          owner: {
            name: d.criador.nome
          },
          participants: d.participantes.map((p: any) => {
            return {
              id: p.id,
              user: {
                name: p.usuario.nome,
                avatarUrl: p.usuario.avatarUrl
              }
            } as ParticipantProps;
          }),
          _count: {
            participants: d._count.participantes
          }
        } as PoolProps;
      }))
    } catch (e: any) {
      console.error(e)
      toast.show({
        title: "Não foi possível listar bolões!",
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // carrega sempre no novo foco na tela
  useFocusEffect(useCallback(() => {
    getBoloes()
  }, []))

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor={'gray.900'}>
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor={'gray.600'} pb={4} mb={4}>
        <Button title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size='md' />}
          onPress={() => {
            navigate('find')
          }}
        />
      </VStack>

      {isLoading
        ?
        <Loading />
        :
        <FlatList
          data={boloes}
          keyExtractor={(item: PoolProps) => item.id}
          renderItem={({ item }) => {
            return (
              <PoolCard
                data={item}
                onPress={() => navigate('details', { id: item.id })}
              />
            )
          }
          }
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      }
    </VStack>
  )
}