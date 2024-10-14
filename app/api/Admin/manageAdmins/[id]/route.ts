import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Client from '@/models/client';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
  
      // Vérifier que la requête contient bien des données
      const requestBodyText = await req.text();
      if (!requestBodyText) {
        return NextResponse.json({ error: "Request body is empty." }, { status: 400 });
      }
  
      // Parse le corps de la requête de manière sécurisée
      const {
        newFirstName: firstName,
        newLastName: lastName,
        newEmail: email,
        newBirthday: birthday,
        newPhoneNumber: phoneNumber,
        newIdentifiant: identifiant,
        newAdress: adress,
        newRole: role,
        newPassword: password
      } = JSON.parse(requestBodyText);
  
      // Connectez-vous à la base de données
      await connect();
  
      // Mettre à jour l'administrateur dans la base de données
      const updatedAdmin = await Client.findByIdAndUpdate(
        id,
        { firstName, lastName, email, birthday, phoneNumber, identifiant, adress, role, password },
        { new: true }  // Renvoie l'objet mis à jour
      );
  
      // Si l'administrateur n'est pas trouvé, retournez une erreur
      if (!updatedAdmin) {
        return NextResponse.json({ error: "Admin not found." }, { status: 404 });
      }
  
      // Réponse réussie avec les nouvelles données mises à jour
      return NextResponse.json({ message: 'Admin updated successfully', updatedAdmin });
  
    } catch (error) {
      console.error("Error updating admin:", error);
      return NextResponse.json({ error: "Failed to update admin." }, { status: 500 });
    }
  }
  