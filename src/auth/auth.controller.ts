import { Controller, Get, UseGuards, Body, BadRequestException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserCatDto } from '../user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiUseTags('权限管理')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({title: '登录'})
  async login(@Body() loginUserDto: LoginUserCatDto): Promise<any> {
    const user = await this.userService.findOne(loginUserDto);
    if(!user){
      throw new BadRequestException('用户名或密码错误!')
    }
    return await this.authService.signIn({
      id: user.id,
      username: user.username
    });
  }
}
