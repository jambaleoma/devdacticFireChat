import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) { }

  // Easy access from from fields
  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get username() {
    return this.registerForm.get('username');
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required]]
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.chatService.signUp(this.registerForm.value).then(user => {
      loading.dismiss();
      this.router.navigateByUrl('/chat', { replaceUrl: true });
    }, async (err) => {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Sign up failed',
        message: err.message,
        buttons: ['OK']
      });

      await alert.present();
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
