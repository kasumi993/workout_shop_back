import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategorySeedService {
  private readonly logger = new Logger(CategorySeedService.name);

  constructor(private prisma: PrismaService) {}

  async seedSportsCategories() {
    this.logger.log('Starting sports categories seeding...');

    // Define categories with their hierarchy
    const categoriesData = [
      {
        name: 'Musculation & Fitness',
        emoji: '🏋️',
        properties: [
          {
            name: 'matériau',
            values: ['acier', 'fonte', 'caoutchouc', 'vinyle', 'plastique'],
          },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'professionnel'],
          },
          {
            name: 'couleur',
            values: ['noir', 'gris', 'rouge', 'bleu', 'vert'],
          },
        ],
        subcategories: [
          {
            name: 'Bancs de musculation',
            properties: [
              {
                name: 'type',
                values: ['plat', 'inclinable', 'déclinable', 'multifonction'],
              },
              {
                name: 'charge_max',
                values: ['100kg', '150kg', '200kg', '300kg'],
              },
            ],
          },
          {
            name: 'Haltères & barres',
            properties: [
              {
                name: 'type',
                values: [
                  'haltères fixes',
                  'haltères réglables',
                  'barres olympiques',
                  'barres EZ',
                ],
              },
              {
                name: 'poids',
                values: ['1kg', '2kg', '5kg', '10kg', '15kg', '20kg', '25kg'],
              },
            ],
          },
          {
            name: 'Kettlebells',
            properties: [
              {
                name: 'poids',
                values: [
                  '4kg',
                  '8kg',
                  '12kg',
                  '16kg',
                  '20kg',
                  '24kg',
                  '28kg',
                  '32kg',
                ],
              },
              { name: 'matériau', values: ['fonte', 'acier', 'vinyle'] },
            ],
          },
          {
            name: 'Élastiques de résistance',
            properties: [
              {
                name: 'résistance',
                values: ['légère', 'moyenne', 'forte', 'extra-forte'],
              },
              { name: 'type', values: ['bandes', 'tubes', 'mini-bandes'] },
            ],
          },
          {
            name: 'Appareils multifonctions',
            properties: [
              {
                name: 'type',
                values: ['home gym', 'station de musculation', 'poulie'],
              },
              {
                name: 'nb_exercices',
                values: ['10-20', '20-30', '30-50', '50+'],
              },
            ],
          },
          {
            name: 'Racks & cages',
            properties: [
              {
                name: 'type',
                values: ['rack squat', 'cage power', 'demi-rack'],
              },
              { name: 'hauteur', values: ['180cm', '200cm', '220cm', '240cm'] },
            ],
          },
        ],
      },
      {
        name: 'Yoga & Pilates',
        emoji: '🧘',
        properties: [
          {
            name: 'matériau',
            values: ['PVC', 'TPE', 'caoutchouc naturel', 'liège', 'coton'],
          },
          { name: 'niveau', values: ['débutant', 'intermédiaire', 'avancé'] },
          {
            name: 'couleur',
            values: ['violet', 'bleu', 'vert', 'rose', 'noir', 'gris'],
          },
        ],
        subcategories: [
          {
            name: 'Tapis de yoga',
            properties: [
              {
                name: 'épaisseur',
                values: ['3mm', '4mm', '6mm', '8mm', '10mm'],
              },
              { name: 'taille', values: ['173x61cm', '183x61cm', '200x66cm'] },
            ],
          },
          {
            name: 'Ballons de gym',
            properties: [
              {
                name: 'diamètre',
                values: ['45cm', '55cm', '65cm', '75cm', '85cm'],
              },
              { name: 'charge_max', values: ['100kg', '150kg', '200kg'] },
            ],
          },
          {
            name: 'Briques & sangles',
            properties: [
              {
                name: 'type',
                values: [
                  'briques EVA',
                  'briques liège',
                  'sangles coton',
                  'sangles nylon',
                ],
              },
              { name: 'longueur_sangle', values: ['180cm', '240cm', '300cm'] },
            ],
          },
          {
            name: 'Roues de yoga',
            properties: [
              { name: 'diamètre', values: ['30cm', '32cm', '35cm'] },
              { name: 'matériau', values: ['ABS', 'TPE'] },
            ],
          },
          {
            name: 'Vêtements yoga',
            properties: [
              {
                name: 'type',
                values: ['leggings', 'brassières', 't-shirts', 'shorts'],
              },
              { name: 'taille', values: ['XS', 'S', 'M', 'L', 'XL'] },
            ],
          },
        ],
      },
      {
        name: 'Running & Cardio',
        emoji: '🏃',
        properties: [
          {
            name: 'type_utilisation',
            values: ['domicile', 'extérieur', 'salle de sport'],
          },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'professionnel'],
          },
        ],
        subcategories: [
          {
            name: 'Tapis de course',
            properties: [
              {
                name: 'vitesse_max',
                values: ['10km/h', '15km/h', '20km/h', '25km/h'],
              },
              { name: 'surface', values: ['100x35cm', '120x40cm', '140x45cm'] },
            ],
          },
          {
            name: "Vélos d'appartement",
            properties: [
              { name: 'type', values: ['droit', 'semi-allongé', 'spinning'] },
              {
                name: 'résistance',
                values: ['magnétique', 'électromagnétique', 'à friction'],
              },
            ],
          },
          {
            name: 'Rameurs',
            properties: [
              {
                name: 'type_résistance',
                values: ['air', 'magnétique', 'eau', 'hydraulique'],
              },
              {
                name: 'poids_max_utilisateur',
                values: ['100kg', '120kg', '150kg'],
              },
            ],
          },
          {
            name: 'Cordes à sauter',
            properties: [
              {
                name: 'matériau_corde',
                values: ['nylon', 'cuir', 'acier gainé', 'PVC'],
              },
              { name: 'longueur', values: ['2.5m', '3m', 'réglable'] },
            ],
          },
          {
            name: 'Montres cardio / trackers',
            properties: [
              {
                name: 'type',
                values: ['montre GPS', 'bracelet connecté', 'ceinture cardio'],
              },
              {
                name: 'autonomie',
                values: ['5-7 jours', '10-14 jours', '20+ jours'],
              },
            ],
          },
          {
            name: 'Chaussures de running',
            properties: [
              {
                name: 'type_foulée',
                values: ['universelle', 'pronatrice', 'supinatrice'],
              },
              { name: 'drop', values: ['0mm', '4mm', '8mm', '10mm', '12mm'] },
              {
                name: 'pointure',
                values: [
                  '36',
                  '37',
                  '38',
                  '39',
                  '40',
                  '41',
                  '42',
                  '43',
                  '44',
                  '45',
                  '46',
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Sports collectifs',
        emoji: '🏀',
        properties: [
          {
            name: 'sport',
            values: [
              'football',
              'basketball',
              'volleyball',
              'rugby',
              'handball',
            ],
          },
          {
            name: 'niveau',
            values: ['loisir', 'compétition', 'professionnel'],
          },
        ],
        subcategories: [
          {
            name: 'Football',
            properties: [
              {
                name: 'type',
                values: [
                  'ballons',
                  'cages',
                  'protège-tibias',
                  'chaussures',
                  'maillots',
                ],
              },
              {
                name: 'taille_ballon',
                values: ['taille 3', 'taille 4', 'taille 5'],
              },
            ],
          },
          {
            name: 'Basketball',
            properties: [
              {
                name: 'type',
                values: ['paniers', 'ballons', 'chaussures', 'maillots'],
              },
              {
                name: 'hauteur_panier',
                values: ['2.30m', '2.60m', '3.05m', 'réglable'],
              },
            ],
          },
          {
            name: 'Volleyball',
            properties: [
              {
                name: 'type',
                values: ['filets', 'ballons', 'chaussures', 'genouillères'],
              },
              { name: 'usage', values: ['intérieur', 'extérieur', 'plage'] },
            ],
          },
          {
            name: 'Rugby',
            properties: [
              {
                name: 'type',
                values: [
                  'ballons',
                  'protège-dents',
                  'épaulières',
                  'chaussures',
                ],
              },
              {
                name: 'taille_ballon',
                values: ['taille 3', 'taille 4', 'taille 5'],
              },
            ],
          },
          {
            name: 'Handball',
            properties: [
              {
                name: 'type',
                values: ['ballons', 'chaussures', 'maillots', 'protections'],
              },
              {
                name: 'taille_ballon',
                values: ['taille 0', 'taille 1', 'taille 2', 'taille 3'],
              },
            ],
          },
        ],
      },
      {
        name: 'Cross Training & HIIT',
        emoji: '🏋️‍♀️',
        properties: [
          { name: 'intensité', values: ['modérée', 'élevée', 'très élevée'] },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'expert'],
          },
        ],
        subcategories: [
          {
            name: 'Box jumps',
            properties: [
              {
                name: 'hauteur',
                values: ['30cm', '40cm', '50cm', '60cm', '75cm'],
              },
              { name: 'matériau', values: ['bois', 'mousse', 'métal'] },
            ],
          },
          {
            name: 'Sacs de frappe',
            properties: [
              {
                name: 'poids',
                values: ['20kg', '30kg', '40kg', '50kg', '60kg'],
              },
              { name: 'type', values: ['sur pied', 'suspendu', 'aqua-bag'] },
            ],
          },
          {
            name: 'Cordes ondulatoires (battle ropes)',
            properties: [
              { name: 'longueur', values: ['9m', '12m', '15m', '18m'] },
              { name: 'diamètre', values: ['38mm', '50mm'] },
            ],
          },
          {
            name: 'Gilets lestés',
            properties: [
              {
                name: 'poids',
                values: ['5kg', '10kg', '15kg', '20kg', '30kg'],
              },
              { name: 'ajustable', values: ['oui', 'non'] },
            ],
          },
          {
            name: 'Anneaux & barres de traction',
            properties: [
              {
                name: 'type',
                values: [
                  'anneaux gymnastique',
                  'barre de traction porte',
                  'barre murale',
                ],
              },
              { name: 'charge_max', values: ['100kg', '150kg', '200kg'] },
            ],
          },
        ],
      },
      {
        name: 'Sports de combat',
        emoji: '🥊',
        properties: [
          {
            name: 'discipline',
            values: [
              'boxe',
              'karaté',
              'judo',
              'taekwondo',
              'MMA',
              'kickboxing',
            ],
          },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'compétition'],
          },
        ],
        subcategories: [
          {
            name: 'Gants de boxe',
            properties: [
              {
                name: 'poids',
                values: ['8oz', '10oz', '12oz', '14oz', '16oz'],
              },
              {
                name: 'type',
                values: ['entraînement', 'sparring', 'compétition'],
              },
            ],
          },
          {
            name: 'Protections',
            properties: [
              {
                name: 'type',
                values: ['casques', 'plastrons', 'coquilles', 'tibiales'],
              },
              { name: 'taille', values: ['S', 'M', 'L', 'XL'] },
            ],
          },
          {
            name: 'Pao & sacs de frappe',
            properties: [
              {
                name: 'type',
                values: ['paos', 'mitaines', 'sacs lourds', 'sacs vitesse'],
              },
              { name: 'matériau', values: ['cuir', 'synthétique'] },
            ],
          },
          {
            name: "Tenues d'arts martiaux",
            properties: [
              {
                name: 'discipline',
                values: ['judo', 'karaté', 'taekwondo', 'jiu-jitsu'],
              },
              {
                name: 'taille',
                values: [
                  '110',
                  '120',
                  '130',
                  '140',
                  '150',
                  '160',
                  '170',
                  '180',
                  '190',
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Sports de plein air',
        emoji: '🚴',
        properties: [
          {
            name: 'saison',
            values: ['printemps', 'été', 'automne', 'hiver', 'toute saison'],
          },
          {
            name: 'terrain',
            values: ['route', 'tout-terrain', 'urbain', 'montagne'],
          },
        ],
        subcategories: [
          {
            name: 'Vélos & accessoires',
            properties: [
              {
                name: 'type',
                values: ['VTT', 'route', 'urbain', 'électrique'],
              },
              { name: 'taille_roue', values: ['26"', '27.5"', '28"', '29"'] },
            ],
          },
          {
            name: 'Trottinettes',
            properties: [
              {
                name: 'type',
                values: ['classique', 'électrique', 'tout-terrain'],
              },
              { name: 'âge', values: ['enfant', 'ado', 'adulte'] },
            ],
          },
          {
            name: 'Rollers',
            properties: [
              {
                name: 'type',
                values: ['fitness', 'freeskate', 'agressif', 'vitesse'],
              },
              {
                name: 'pointure',
                values: [
                  '35',
                  '36',
                  '37',
                  '38',
                  '39',
                  '40',
                  '41',
                  '42',
                  '43',
                  '44',
                  '45',
                ],
              },
            ],
          },
          {
            name: 'Skates',
            properties: [
              { name: 'type', values: ['street', 'cruiser', 'longboard'] },
              { name: 'largeur', values: ['7.5"', '8"', '8.25"', '8.5"'] },
            ],
          },
          {
            name: 'Lunettes de sport',
            properties: [
              {
                name: 'sport',
                values: ['cyclisme', 'running', 'ski', 'escalade'],
              },
              {
                name: 'protection',
                values: ['UV400', 'polarisées', 'photochromiques'],
              },
            ],
          },
          {
            name: 'Gants / protections',
            properties: [
              {
                name: 'type',
                values: [
                  'gants cyclisme',
                  'genouillères',
                  'coudières',
                  'casques',
                ],
              },
              { name: 'taille', values: ['XS', 'S', 'M', 'L', 'XL'] },
            ],
          },
        ],
      },
      {
        name: 'Sports de raquette',
        emoji: '🎾',
        properties: [
          {
            name: 'sport',
            values: ['tennis', 'badminton', 'ping-pong', 'padel', 'squash'],
          },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'expert'],
          },
        ],
        subcategories: [
          {
            name: 'Tennis',
            properties: [
              {
                name: 'type',
                values: ['raquettes', 'balles', 'chaussures', 'cordages'],
              },
              {
                name: 'poids_raquette',
                values: ['250g', '280g', '300g', '320g'],
              },
            ],
          },
          {
            name: 'Badminton',
            properties: [
              {
                name: 'type',
                values: ['raquettes', 'volants', 'chaussures', 'cordages'],
              },
              { name: 'poids_raquette', values: ['75g', '80g', '85g', '90g'] },
            ],
          },
          {
            name: 'Ping-pong',
            properties: [
              {
                name: 'type',
                values: ['raquettes', 'balles', 'tables', 'filets'],
              },
              {
                name: 'niveau_raquette',
                values: ['loisir', 'club', 'compétition'],
              },
            ],
          },
          {
            name: 'Padel',
            properties: [
              {
                name: 'type',
                values: ['raquettes', 'balles', 'chaussures', 'sacs'],
              },
              { name: 'forme_raquette', values: ['ronde', 'diamant', 'larme'] },
            ],
          },
        ],
      },
      {
        name: 'Natation & Sports aquatiques',
        emoji: '🏊',
        properties: [
          { name: 'usage', values: ['piscine', 'mer', 'lac', 'rivière'] },
          {
            name: 'niveau',
            values: ['débutant', 'intermédiaire', 'avancé', 'compétition'],
          },
        ],
        subcategories: [
          {
            name: 'Maillots de bain',
            properties: [
              {
                name: 'type',
                values: ['une pièce', 'deux pièces', 'combinaison'],
              },
              { name: 'taille', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
            ],
          },
          {
            name: 'Bonnet, lunettes',
            properties: [
              {
                name: 'type',
                values: [
                  'bonnets silicone',
                  'bonnets tissu',
                  'lunettes piscine',
                  'lunettes mer',
                ],
              },
              { name: 'protection', values: ['UV', 'anti-buée', 'polarisées'] },
            ],
          },
          {
            name: 'Palmes / plaquettes',
            properties: [
              {
                name: 'type',
                values: ['palmes courtes', 'palmes longues', 'plaquettes nage'],
              },
              {
                name: 'pointure',
                values: ['35-36', '37-38', '39-40', '41-42', '43-44', '45-46'],
              },
            ],
          },
          {
            name: 'Matériel de plongée',
            properties: [
              {
                name: 'type',
                values: ['masques', 'tubas', 'combinaisons', 'détendeurs'],
              },
              {
                name: 'niveau',
                values: ['snorkeling', 'plongée libre', 'plongée bouteille'],
              },
            ],
          },
        ],
      },
      {
        name: 'Camping & Outdoor',
        emoji: '⛺',
        properties: [
          { name: 'saison', values: ['3 saisons', '4 saisons', 'été'] },
          {
            name: 'usage',
            values: ['camping', 'randonnée', 'bivouac', 'festival'],
          },
        ],
        subcategories: [
          {
            name: 'Tentes',
            properties: [
              {
                name: 'nb_places',
                values: [
                  '1 place',
                  '2 places',
                  '3 places',
                  '4 places',
                  '6+ places',
                ],
              },
              {
                name: 'type',
                values: ['dôme', 'tunnel', 'géodésique', 'tipi'],
              },
            ],
          },
          {
            name: 'Sacs de couchage',
            properties: [
              {
                name: 'température',
                values: ['+10°C', '0°C', '-10°C', '-20°C'],
              },
              { name: 'garnissage', values: ['duvet', 'synthétique'] },
            ],
          },
          {
            name: 'Réchauds',
            properties: [
              {
                name: 'combustible',
                values: ['gaz', 'essence', 'alcool', 'bois'],
              },
              {
                name: 'puissance',
                values: ['1000W', '2000W', '3000W', '4000W'],
              },
            ],
          },
          {
            name: 'Lampes frontales',
            properties: [
              {
                name: 'puissance',
                values: [
                  '100 lumens',
                  '200 lumens',
                  '400 lumens',
                  '800 lumens',
                ],
              },
              { name: 'autonomie', values: ['5h', '10h', '20h', '50h'] },
            ],
          },
        ],
      },
    ];

    // Clear existing categories (optional - remove if you want to keep existing ones)
    // await this.prisma.category.deleteMany();

    // Create categories
    for (const categoryData of categoriesData) {
      this.logger.log(`Creating category: ${categoryData.name}`);

      // Create main category
      const mainCategory = await this.prisma.category.create({
        data: {
          name: categoryData.name,
          properties: categoryData.properties,
        },
      });

      // Create subcategories
      for (const subcat of categoryData.subcategories) {
        this.logger.log(`  Creating subcategory: ${subcat.name}`);

        await this.prisma.category.create({
          data: {
            name: subcat.name,
            parentId: mainCategory.id,
            properties: subcat.properties || [],
          },
        });
      }
    }

    this.logger.log('Sports categories seeding completed successfully!');
  }
}
