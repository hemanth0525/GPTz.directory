import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, CollectionReference, DocumentData } from 'firebase/firestore'
import { addDoc as firestoreAddDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''),
    authDomain: String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''),
    projectId: String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''),
    storageBucket: String(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''),
    messagingSenderId: String(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''),
    appId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''),
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const gptsCollection = 'gpts_live'
export const gptsReviewCollection = 'gpts_review'
export const subscribersCollection = collection(db, 'subscribers')

export async function addSubscriber(email: string) {
    try {
        await addDoc(subscribersCollection, {
            email,
            subscribedAt: new Date().toISOString()
        })
        return true
    } catch (error) {
        console.error('Error adding subscriber:', error)
        return false
    }
}

async function addDoc(collectionRef: CollectionReference<DocumentData>, data: { email: string; subscribedAt: string }) {
    try {
        await firestoreAddDoc(collectionRef, data)
    } catch (error) {
        console.error('Error adding document:', error)
        throw error
    }
}

