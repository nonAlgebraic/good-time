import React, { FC, ReactNode } from 'react'
import { useMachine } from 'use-machine'
import { Config, Options, Context } from '../state/ParticipantMachine'

const ParticipantProvider: FC<{
	children: ReactNode
}> = ({ children }) => {
	const machine = useMachine(Config, Options)

	return <Context.Provider value={machine}>{children}</Context.Provider>
}

export default ParticipantProvider
