import { useNavigation } from '@react-navigation/native';
import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../clients/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  pollCode: string;
}

const getGuess = (d: any) => {
  return d.palpites.length > 0 && {
    guess: {
      id: d.palpites[0].id,
      firstTeamPoints: d.palpites[0].firstTeamPoints,
      secondTeamPoints: d.palpites[0].secondTeamPoints,
      createdAt: d.palpites[0].dtCriado,
      gameId: d.palpites[0].jogoId,
      participantId: d.palpites[0].participanteId,
    }
  }
}

export function Guesses({ poolId, pollCode }: Props) {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [firstPoints, setFirstPoints] = useState<string>('');
  const [secondPoints, setSecondPoints] = useState<string>('');
  const [jogos, setJogos] = useState<GameProps[]>([]);


  async function buscarJogos() {
    try {
      setIsLoading(true)
      const { status, data } = await api.get(`/bolao/${poolId}/jogos`)

      setJogos(data.map((d: any) => {
        return {
          id: d.id,
          date: d.data,
          firstTeamCountryCode: d.firstTeamIsoCountry,
          secondTeamCountryCode: d.secondTeamIsoCountry,
          ...getGuess(d)
        } as GameProps;
      }))

      setIsLoading(false);
    } catch (e: any) {
      console.error(e)
      toast.show({
        title: "Não foi possível buscar os jogos!",
        placement: 'top',
        bgColor: 'red.500'
      })

      navigate('details', { id: poolId })
    }
  }

  async function handlerPalpitar(jogoId: string) {
    try {
      setIsLoading(true);

      if (!firstPoints || firstPoints.trim().length === 0
        || !firstPoints || firstPoints.trim().length === 0) {
        return toast.show({
          title: "Informe o placar do palpite",
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/bolao/${poolId}/jogos/${jogoId}/palpitar`, {
        firstTeamPoints: Number(firstPoints),
        secondTeamPoints: Number(secondPoints)
      })

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: 'top',
        bgColor: 'green.500'
      })

      await buscarJogos();
    } catch (e: any) {
      console.error(e)
      toast.show({
        title: "Não foi possível participar do jogo!",
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setFirstPoints('')
      setSecondPoints('')
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarJogos();
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={jogos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          onGuessConfirm={() => handlerPalpitar(item.id)}
          setFirstTeamPoints={setFirstPoints}
          setSecondTeamPoints={setSecondPoints}
        />
      )}
      ListEmptyComponent={<EmptyMyPoolList code={pollCode} />}
      removeClippedSubviews={false}
    />
  );
}
