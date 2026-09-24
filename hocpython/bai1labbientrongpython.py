exchange_rate = float(input('Nhập tỷ giá hối đoái từ đơn vị tiền tệ A sang B: '))
amount_in_currency_a = float(input('Nhập số tiền đơn vị A mà bạn muốn quy đổi: '))
amount_in_currency_b = amount_in_currency_a * exchange_rate
print(f'Số tiền tương ứng ở đơn vị tiền tệ B:{amount_in_currency_b:.2f}') 