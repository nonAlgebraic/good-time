import React, { FC, ReactNode, useContext } from 'react'
import { Subscription } from 'react-apollo'
import { useMachine } from 'use-machine'
import { assign } from 'xstate'
import { Config, UpdateEvent, Context } from '../state/RoomMachine'
import { Context as ParticipantContext } from '../state/ParticipantMachine'
import { Room } from '../state/types'

const RoomProvider: FC<{
	children: ReactNode
}> = ({ children }) => {
	const machine = useMachine(Config, {
		actions: {
			update: assign((_context, event) => (event as UpdateEvent).data),
			clear: assign(() => ({})),
		},
	})

	const participantMachine = useContext(ParticipantContext)

	return (
		<Subscription<Room>>
			{({ loading, data, error }) => {
				if (!loading && !error && data) {
					const newData = { ...data }

					if (newData.queue[0]) {
						if (newData.queue[0].id === participantMachine.context.id) {
							participantMachine.send('NEXT')
						}
					}

					machine.send({
						data: newData,
						type: 'UPDATE',
					})
				} else {
					machine.send({
						type: 'UNSUBSCRIBE',
					})
				}
				if (data && data.queue.length && data.queue[0].id) {
					return <Context.Provider value={machine}>{children}</Context.Provider>
				}
			}}
		</Subscription>
	)
}

export default RoomProvider