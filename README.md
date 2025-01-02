<div align="center">

![GitHub Repo stars](https://img.shields.io/github/stars/itu-helper/sdk)
![GitHub issues](https://img.shields.io/github/issues-raw/itu-helper/sdk?label=Issues&style=flat-square)

# **ITU Helper**

</div>
    
<div align="left">
    <img src="https://raw.githubusercontent.com/itu-helper/home/main/images/logo.png" align="right"
     alt="ITU Helper Logo" width="180" height="180">
</div>
<div align="center">

_İTÜ'lüler için İTÜ'lülerden_

_ITU Helper_ İstanbul Teknik Üniversitesi öğrencilerine yardım etmek amacıyla ön şart görselleştirme, ders planı oluşturma ve resmi İTÜ sitelerini birleştirme gibi hizmetler sağlayan bir açık kaynaklı websitesidir.

_ITU Helper_'a [_bu adresten_](https://itu-helper.github.io/home/) ulaşabilirsiniz.

</div>
<br>
<br>
<br>

# **itu-helper/sdk**

## **Ne İşe Yarar?**

[itu-helper/data-updater](https://github.com/itu-helper/data-updater) _repo_'suyla toplanan ve [itu-helper/data](https://github.com/itu-helper/data) _repo_'sunda saklanan verilere, kolayca ulaşılmasına olanak sağlar.

> [!NOTE]
> Verilerin nasıl isimlendirildiğine ve güncelleme sıklığına ulaşmak için, [itu-helper/data-updater](https://github.com/itu-helper/data-updater) _repo_'sununa bakınız.

## **Nasıl Kullanılır?**

### **JavaScript**

`<body>` _tag_'inin en alt kısmına şu satırı ekleyerek _script_'leri importlamanız lazım.

```html
<script src="https://cdn.jsdelivr.net/gh/itu-helper/sdk@master/js/dist/bundle.min.js"></script>
```

JavaScript SDK'sinin detaylı kullanımı için [buraya](js/README.md) bakınız.

### **HTTP Request**

Programlama dilinden bağımsız olarak, verilere _HTTP request_ göndererek de ulaşabilirsiniz. Ders planları `.txt` formatında, kalan veriler ise `.psv` (Pipe separated values) formatında saklanmakta. Aşağıdaki linklerden, dosyalara ulaşabilir ve okuyabilirsiniz.

- Dersler (_lessons_): https://raw.githubusercontent.com/itu-helper/data/main/lessons.psv

- Dersler (_courses_): https://raw.githubusercontent.com/itu-helper/data/main/courses.psv

- Ders Planları: https://raw.githubusercontent.com/itu-helper/data/main/course_plans.txt

- Bina Kodları: https://raw.githubusercontent.com/itu-helper/data/main/building_codes.psv

- Program Kodları: https://raw.githubusercontent.com/itu-helper/data/main/programme_codes.psv

#### **Python Örneği**

Aşağıdaki kodda _requests_ modülüyle; CRN kullanarak, dersin [bu sayfadaki](https://obs.itu.edu.tr/public/DersProgram) verilerine erişim gösterilmiştir.

```python
from requests import get

URL = "https://raw.githubusercontent.com/itu-helper/data/main/lessons.psv"

# Dersleri (lessons) oku ve satır satır ayır.
lines = get(URL).text.split("\n")

# .psv formatından dolayı, her bir satırdaki elementler "|" sembolü ile ayırılıyor.
# İlk eleman, dersin CRN'si. CRN'lerin "key", satırın tamamının da "value" olduğu bir sözlük oluştur.
crn_to_lesson = {line.split("|")[0] : line for line in lines}

print(crn_to_lesson["13590"])
# OUTPUT
# '13590|BLG 212E|Fiziksel (Yüz yüze)|Gökhan İnce|BBB|Monday|08:30/11:29 - |Z-18|120|111|BLG_LS, BLGE_LS, CEN_LS'
```
