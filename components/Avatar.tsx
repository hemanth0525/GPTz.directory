import React from 'react'
import { User } from 'lucide-react'

type AnonymousAvatarProps = {
    size?: number
    seed?: string
}

export function Avatar({ size = 40, seed }: AnonymousAvatarProps) {
    return (
        <div
            style={{
                width: size,
                height: size,
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #ff69b4, #4169e1)',
                    position: 'absolute'
                }}
            />
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'white',
                    fontSize: `${size * 0.4}px`,
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}
            >
                {seed ? seed[0] : <User size={size * 0.6} />}
            </div>
        </div>
    )
}
