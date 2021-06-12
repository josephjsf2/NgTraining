import { Component, OnInit } from '@angular/core';
import { MemberAccount } from 'src/app/shared/models/member-account.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profile: MemberAccount;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.profile = this.authService.userProfile;
  }

}
