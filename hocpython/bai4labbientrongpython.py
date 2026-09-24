a = input('Nhập dãy số nguyên,cách nhau bởi dấu cách: ')
b = list(map(int,a.split()))
c = max(b)
print(f'Số lớn nhất trong dãy số là: {c}')