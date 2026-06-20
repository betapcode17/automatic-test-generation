import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: { id: string }) {
    return this.cart.getCart(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: { id: string }, @Body() body: { productId: string; quantity?: number }) {
    return this.cart.addItem(user.id, body.productId, body.quantity);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cart.updateItem(id, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.cart.removeItem(id);
  }
}
