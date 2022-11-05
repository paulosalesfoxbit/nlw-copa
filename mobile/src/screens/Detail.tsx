import { useNavigation, useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from 'react-native';
import { api } from '../clients/api';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { EmptyRakingList } from '../components/EmptyRakingList';
import { Guesses } from '../components/Guesses';
import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { ParticipantProps } from '../components/Participants';
import { PoolProps } from "../components/PoolCard";
import { PoolHeader } from '../components/PoolHeader';

interface RouteParams {
  id: string;
}

export function Detail() {
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [optSelected, setOptSelected] = useState<'palpites' | 'ranking'>('palpites')
  const [bolao, setBolao] = useState<PoolProps>({} as PoolProps);

  async function buscarBolao() {
    try {
      setIsLoading(true);
      const { status, data } = await api.get(`/bolao/${id}`)

      if (status !== 200) {
        toast.show({
          title: data.message,
          placement: 'top',
          bgColor: 'red.500'
        })
        return navigate('polls')
      }

      setBolao({
        id: data.id,
        code: data.codigo,
        title: data.titulo,
        createdAt: data.dtCriado,
        ownerId: data.criadorId,
        owner: {
          name: data.criador.nome
        },
        participants: data.participantes.map(
          (p: any) => {
            return {
              id: p.id,
              user: {
                name: p.usuario.nome,
                avatarUrl: p.usuario.avatarUrl
              }
            } as ParticipantProps;
          }
        ),
        _count: {
          participants: data._count.participantes
        }
      } as PoolProps)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      console.error(e)
      toast.show({
        title: "Não foi possível buscar o bolão!",
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function handleShareCode() {
    await Share.share({ message: bolao.code })
  }

  useEffect(() => {
    buscarBolao();
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={bolao.title}
        showBackButton
        showShareButton
        onPressShare={handleShareCode}
      />
      {
        bolao._count?.participants > 0
          ?
          <VStack flex={1} px={5}>
            <PoolHeader data={bolao} />
            <HStack bgColor="gray.800" p={1} rounded='sm' mb={5}>
              <Option
                title="Seus palpites"
                isSelected={optSelected === 'palpites'}
                onPress={() => setOptSelected('palpites')}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optSelected === 'ranking'}
                onPress={() => setOptSelected('ranking')}
              />
            </HStack>
            {optSelected === 'palpites' && <Guesses poolId={bolao.id} pollCode={bolao.code} />}
            {optSelected === 'ranking' && <EmptyRakingList />}
          </VStack>
          :
          <EmptyMyPoolList code={bolao.code} />
      }
    </VStack>
  );
}