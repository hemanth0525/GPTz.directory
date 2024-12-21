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
            className="py-16 bg-gradient-to-b from-background to-muted"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-12 text-center glow-text">Why We Built GPTz.directory</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex justify-center mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                            <p className="text-muted-foreground text-center">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}

