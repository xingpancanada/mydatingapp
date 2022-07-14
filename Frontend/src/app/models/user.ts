export interface IUser {
  username: string;  //Backend MemberDto should be UserName
  token: string;
  photoUrl: string;
  knownAs: string;
  gender: string;
  roles: string[];
}
