import tkinter as tk #thư viện giao diện của người dùng và đặt tên 
class VirtualCalculator : #định nghĩa 1 lớp để quản lý toàn bộ giao diện và logic của máy tính
    def __init__(self,root): #hàm khởi tạo()
        self.root = root
        self.root.title("Virtual Calculator")
        self.root.geometry("350x450")
        self.root.configure(bg='#B3E5FC')
        self.expression = ""
        self.display_var = tk.StringVar()
        self.display = tk.Entry(
            root, 
            textvariable=self.display_var, 
            font=("Time New Roman", 16), 
            bg="white", 
            fg="black", 
            justify="right", 
            bd=0
        )
        self.display.grid(row=0, column=0, columnspan=4, ipadx=8, ipady=25, padx=20, pady=(20, 0), sticky="nsew")
        buttons = [
            ("Clear", 1, 0, 2), ("Delete", 1, 2, 1), ("/", 1, 3, 1),
            ("7", 2, 0, 1),     ("8", 2, 1, 1),      ("9", 2, 2, 1), ("*", 2, 3, 1),
            ("4", 3, 0, 1),     ("5", 3, 1, 1),      ("6", 3, 2, 1), ("-", 3, 3, 1),
            ("1", 4, 0, 1),     ("2", 4, 1, 1),      ("3", 4, 2, 1), ("+", 4, 3, 1),
            ("0", 5, 1, 1),     ("=", 5, 2, 1)
        ]
        for i in range(6):
            self.root.grid_rowconfigure(i, weight=1)
        for j in range(4):
            self.root.grid_columnconfigure(j, weight=1)
        for item in buttons:
            text, row, col, colspan = item[0], item[1], item[2], item[3]

            btn = tk.Button(
                root, 
                text=text, 
                font=("Arial", 11), 
                bg="#3FB24D",
                fg="black", 
                bd=1, 
                relief="solid",
                command=lambda t=text: self.on_button_click(t)
            )
            btn.grid(row=row, column=col, columnspan=colspan, sticky="nsew", padx=1, pady=1)    