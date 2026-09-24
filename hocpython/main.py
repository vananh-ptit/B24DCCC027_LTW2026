from rich.console import Console
import pygame 
import time 
console = Console()
pygame.init()
pygame.mixer.init()
pygame.mixer.music.load('song.mp3')
pygame.mixer.music.play()
lyrics = [
    (0.0, '🎵', 'bright_black'), 
(2.0, 'Nước mắt em rơi vậy có đủ khiến anh vui', 'red'),
(Thấy em đau như vậy có đủ khiến anh cười),
(Tổn thương đến mức nào mới thấy),
(Chẳng thể quay lại ngày),
Trái tim chưa đổi thay
Có lẽ đau thương là cái giá để yêu anh
Yêu thương một người có tâm can bằng sắt
Nhìn em khóc như cơn mưa anh đã vừa lòng chưa
Đã khiến anh lay động chưa
Hay em chỉ là kẻ thừa
]
