import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { StammtischDto } from '../dtos/StammtischDto';
import { Auth } from '@angular/fire/auth';
import { PersonDto } from '../dtos/PersonDto';
import { RegistrationDto } from '../dtos/RegistrationDto';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { firstValueFrom, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StammtischService implements OnDestroy {
  firestore = inject(Firestore);
  auth = inject(Auth);
  dialog = inject(MatDialog);

  nextStammtisch = signal<StammtischDto | undefined>(undefined);

  unsubscribe;

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  constructor() {
    this.unsubscribe = onSnapshot(
      collection(this.firestore, 'stammtische'),
      (snapshot) => {
        const stammtische = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const dateData = data['date'];
            const stammtisch: StammtischDto = {
              id: doc.id,
              date: dateData
                ? new Date(
                    dateData.seconds * 1000 + dateData.nanoseconds / 1000000
                  )
                : new Date(),
              drivers: data['drivers'] ?? [],
              participants: data['participants'] ?? [],
            };
            return stammtisch;
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());
        this.nextStammtisch.set(
          stammtische.length > 0 ? stammtische[0] : undefined
        );
      }
    );
  }

  async createStammtisch(selectedDate: Date) {
    if (!selectedDate) {
      alert('Selected Date cannot be empty');
      return;
    }

    const stammtischDto: StammtischDto = {
      id: '',
      date: selectedDate,
      drivers: [],
      participants: [],
    };

    const stammtischeCollection = collection(this.firestore, 'stammtische');

    const querySnapshot = await getDocs(stammtischeCollection);
    const existingStammtisch = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      const dateData = data['date'];
      const existingDate = dateData
        ? new Date(dateData.seconds * 1000 + dateData.nanoseconds / 1000000)
        : new Date();
      return (
        existingDate.getFullYear() === selectedDate.getFullYear() &&
        existingDate.getMonth() === selectedDate.getMonth() &&
        existingDate.getDate() === selectedDate.getDate()
      );
    });

    if (existingStammtisch) {
      alert('A stammtisch with the same date already exists');
      return;
    }

    const newDoc = await addDoc(stammtischeCollection, stammtischDto);
    stammtischDto.id = newDoc.id;
    return updateDoc(newDoc, {
      id: stammtischDto.id,
    });
  }

  async addParticipantToCurrentStammtisch(person: PersonDto) {
    if (!this.nextStammtisch()) {
      throw new Error('No next stammtisch available to update');
    }

    const nextStammtischId = this.nextStammtisch()?.id;

    if (!nextStammtischId) {
      throw new Error('No next stammtisch ID available to update');
    }

    const currentStammtischRef = doc(
      this.firestore,
      'stammtische',
      nextStammtischId
    );

    if (!currentStammtischRef) {
      throw new Error('No stammtisch found with the same date');
    }

    const newParticipants: RegistrationDto[] = this.getNewParticipants(person);
    this.calculateDrivers(newParticipants).then((x) => {
      const driverMapKeys = Array.from(x.keys());

      updateDoc(currentStammtischRef, {
        drivers: driverMapKeys,
        participants: newParticipants,
      });
    });
  }

  removeParticipantFromCurrentStammtisch(person: PersonDto | undefined) {
    if (!this.nextStammtisch()) {
      throw new Error('No next stammtisch available to update');
    }

    const nextStammtischId = this.nextStammtisch()?.id;

    if (!nextStammtischId) {
      throw new Error('No next stammtisch ID available to update');
    }

    const currentStammtischRef = doc(
      this.firestore,
      'stammtische',
      nextStammtischId
    );

    const updatedParticipants = this.nextStammtisch()?.participants.filter(
      (p) => p.person.id !== person?.id
    );

    this.calculateDrivers(updatedParticipants!).then((x) => {
      const driverMapKeys = Array.from(x.keys());

      updateDoc(currentStammtischRef, {
        drivers: driverMapKeys,
        participants: updatedParticipants,
      });
    });
  }

  isPersonAlreadyParticipating(person: PersonDto | undefined) {
    if (!person) {
      return false;
    }
    return (
      this.nextStammtisch()?.participants.some(
        (p) => p.person.id === person.id
      ) ?? false
    );
  }

  private getNewParticipants(person: PersonDto) {
    return [
      ...(this.nextStammtisch()!.participants || []),
      { person: person, registratedAt: new Date() },
    ].distinctBy((x) => x.person.id);
  }

  private async calculateDrivers(newParticipants: RegistrationDto[]) {
    const stammtische = await this.getAllStammtische();
    const driverCountMap = new Map<string, number>();
    const participantCountMap = new Map<string, number>();
    console.log(newParticipants);

    newParticipants.forEach((participant) => {
      participantCountMap.set(participant.person.email, 1);
    });

    stammtische.forEach((stammtisch) => {
      if (stammtisch.drivers && stammtisch.id !== this.nextStammtisch()?.id) {
        stammtisch.drivers.forEach((driver) => {
          // console.log(driverCountMap.get())
          driverCountMap.set(
            driver.email,
            (driverCountMap.get(driver.email) || 0) + 1
          );
        });
      }
      if (stammtisch.id == this.nextStammtisch()?.id) {
        return;
      }
      if (stammtisch.participants) {
        stammtisch.participants.forEach((participant) => {
          const participantKey = participant.person.email;
          const count = participantCountMap.get(participantKey) || 0;
          participantCountMap.set(participantKey, count + 1);
        });
      }
    });

    console.log('driverCount Map', driverCountMap);
    console.log('Participant Map', participantCountMap);

    const driverRatioMap = new Map<string, number>();

    participantCountMap.forEach((participantCount, participantId) => {
      const driverCount = driverCountMap.get(participantId) || 0;
      driverRatioMap.set(participantId, driverCount / participantCount);
    });

    const sortedDriverRatioMap = this.sortDrivers(
      driverRatioMap,
      newParticipants
    );

    const driverRatioPersonMap = new Map<PersonDto, number>();

    sortedDriverRatioMap.forEach((ratio, participantId) => {
      const registration = newParticipants.find(
        (p) => p.person.email === participantId
      );
      if (registration) {
        driverRatioPersonMap.set(registration.person, ratio);
      }
    });

    const numberOfDrivers = Math.max(1, Math.ceil(newParticipants.length / 5));
    const selectedDrivers = Array.from(sortedDriverRatioMap.keys())
      .filter((email) => newParticipants.some((p) => p.person.email === email))
      .slice(0, numberOfDrivers);
    return new Map(
      [...driverRatioPersonMap.entries()].filter(([person]) =>
        selectedDrivers.includes(person.email)
      )
    );
  }

  private sortDrivers(
    filteredDriverRatioMap: Map<string, number>,
    newParticipants: RegistrationDto[]
  ) {
    const sortedDriverRatioMap = this.sortByRatioAndRegistration(
      filteredDriverRatioMap,
      newParticipants
    );
    console.table(sortedDriverRatioMap);
    return sortedDriverRatioMap;
  }

  private sortByRatioAndRegistration(
    driverRatioMap: Map<string, number>,
    newParticipants: RegistrationDto[]
  ) {
    return new Map(
      [...driverRatioMap.entries()].sort((a, b) => {
        if (a[1] === b[1]) {
          const participantA = newParticipants.find(
            (p) => p.person.email === a[0]
          );
          const participantB = newParticipants.find(
            (p) => p.person.email === b[0]
          );
          return (
            (new Date(participantB?.registratedAt ?? 0).getTime() || 0) -
            (new Date(participantA?.registratedAt ?? 0).getTime() || 0)
          );
        }
        return a[1] - b[1];
      })
    );
  }

  async getAllStammtische() {
    const stammtischeCollection = collection(this.firestore, 'stammtische');
    const querySnapshot = await getDocs(stammtischeCollection);
    return querySnapshot.docs.map((doc) => doc.data() as StammtischDto);
  }

  async showDatePicker(): Promise<Date> {
    const dialogRef = this.dialog.open(MatDatepicker);

    const result_1 = await firstValueFrom(dialogRef.afterClosed());
    if (result_1) {
      return result_1;
    } else {
      throw new Error('No date selected');
    }
  }

  nextWednesday() {
    let today = new Date();
    const nextWednesday = new Date(
      today.setDate(today.getDate() + ((3 - today.getDay() + 7) % 7 || 7))
    );
    nextWednesday.setHours(0, 0, 0, 0);
    return nextWednesday;
  }
}
