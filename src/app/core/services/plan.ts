import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';

import {
  Firestore,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';

import { FinancialPlan } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);

  async getPlan(uid: string): Promise<FinancialPlan> {
    try {
      const planSnapshot = await runInInjectionContext(
        this.injector,
        () => {
          const planRef = doc(
            this.firestore,
            `plans/${uid}`,
          );

          return getDoc(planRef);
        },
      );

      if (planSnapshot.exists()) {
        const data = planSnapshot.data();

        return {
          incomeTarget: Number(
            data['incomeTarget'] ?? 0,
          ),
          expenseLimit: Number(
            data['expenseLimit'] ?? 0,
          ),
        };
      }
    } catch (error) {
      console.warn(
        'Plan document could not be loaded. Using profile fallback.',
        error,
      );
    }

    return this.getPlanFallback(uid);
  }

  async savePlan(
    uid: string,
    plan: FinancialPlan,
  ): Promise<void> {
    const payload = {
      incomeTarget: Number(
        plan.incomeTarget || 0,
      ),
      expenseLimit: Number(
        plan.expenseLimit || 0,
      ),
      updatedAt: serverTimestamp(),
    };

    try {
      await runInInjectionContext(
        this.injector,
        () => {
          const planRef = doc(
            this.firestore,
            `plans/${uid}`,
          );

          return setDoc(
            planRef,
            payload,
          );
        },
      );

      return;
    } catch (error) {
      console.warn(
        'Plan document could not be saved. Using profile fallback.',
        error,
      );
    }

    await runInInjectionContext(
      this.injector,
      () => {
        const userRef = doc(
          this.firestore,
          `users/${uid}`,
        );

        return setDoc(
          userRef,
          {
            planConfig: {
              incomeTarget:
                payload.incomeTarget,
              expenseLimit:
                payload.expenseLimit,
            },
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          },
        );
      },
    );
  }

  private async getPlanFallback(
    uid: string,
  ): Promise<FinancialPlan> {
    const userSnapshot = await runInInjectionContext(
      this.injector,
      () => {
        const userRef = doc(
          this.firestore,
          `users/${uid}`,
        );

        return getDoc(userRef);
      },
    );

    if (!userSnapshot.exists()) {
      return {
        incomeTarget: 0,
        expenseLimit: 0,
      };
    }

    const data = userSnapshot.data();
    const planConfig = data['planConfig'] ?? {};

    return {
      incomeTarget: Number(
        planConfig['incomeTarget'] ?? 0,
      ),
      expenseLimit: Number(
        planConfig['expenseLimit'] ?? 0,
      ),
    };
  }
}