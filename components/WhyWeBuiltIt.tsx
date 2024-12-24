import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Compass, Users } from 'lucide-react'

export function WhyWeBuiltIt() {
    const features = [
        {
            icon: <Rocket className="w-12 h-12 text-primary" />,
            title: "Launching Innovation",
            description: "We created GPTz.directory to propel the AI revolution forward, making cutting-edge GPTs accessible to everyone."
        },
        {
            icon: <Compass className="w-12 h-12 text-secondary" />,
            title: "Navigating the AI Universe",
            description: "Our platform serves as a compass, guiding users through the vast galaxy of AI tools and possibilities."
        },
        {
            icon: <Users className="w-12 h-12 text-accent" />,
            title: "Building a Community",
            description: "We're fostering a vibrant ecosystem where AI enthusiasts, developers, and curious minds can connect and collaborate."
        }
    ]

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-background to-muted"
        >
            <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center glow-text">
                    Why We Built GPTz.directory
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-card p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex justify-center mb-3 md:mb-4">
                                {React.cloneElement(feature.icon, {
                                    className: `w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${feature.icon.props.className}`
                                })}
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground text-center">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}

