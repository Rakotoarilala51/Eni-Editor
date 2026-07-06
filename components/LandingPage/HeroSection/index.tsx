import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const HeroSection = (props: Props) => {
  return (
    <div className="w-full flex items-center justify-between py-12 px-8">
        <div>
            <h1 className="text-6xl text-blue-600 font-mono">ENI-Editor</h1>
          <p className="text-gray-500">L'éditeur de code conçu pour l'algorithmique de l'ENI.</p>
          {/* <p>Développez, testez et apprenez les algorithmes avec un éditeur spécialement conçu pour le langage 
            algorithmique enseigné à l'École Nationale d'Informatique.
             Une interface simple, rapide et adaptée aux étudiants comme aux enseignants.</p>

          <p>
            ENI-Editor facilite l'apprentissage de l'algorithmique grâce à un environnement de développement 
            dédié au pseudo-code de l'ENI. Écrivez vos algorithmes, exécutez-les, identifiez les erreurs 
            et améliorez votre logique de programmation dans un outil pensé pour votre parcours académique.
          </p> */}
        </div>  
        <div className=''>
           
            <Image src={'/image/LogoENI-editor.png'} alt="Logo-eni-Editor" width={400} height={400} />
        </div>
           {/* <Link href={'/pseudo-algo'}>
                <button className="border rounded-2xl py-2 px-6 flex gap-1 hover:gap-4 transition-discrete duration-500 cursor-pointer ">Commencer <ArrowRight/> </button>
            </Link> */}
      </div>
  )
}

export default HeroSection